var CST = CST || {};

CST.QuestApp = class QuestApp {
  constructor() {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 12000);
    this.camera.position.set(0, 1.6, 0.12);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    this._attachVrButton();

    this.scene.add(new THREE.HemisphereLight(0x89b4ff, 0x101820, 0.45));

    this.sky = new CST.Sky(this.scene);
    this.sky.group.scale.setScalar(0.02);
    this.earth = new CST.Earth(this.scene);
    this.earth.group.position.set(0, -1.4, -0.8);

    this.constellationIds = this.sky.getIds().sort((a, b) => {
      return this.sky.getConstellation(a).name.localeCompare(this.sky.getConstellation(b).name);
    });
    this.activeIndex = 0;
    this.selectedStar = null;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Sprite = { threshold: 0.35 };
    this.tempMatrix = new THREE.Matrix4();
    this._bufferSizeTarget = new THREE.Vector2();
    this.hoveredStar = null;

    this.overlayRefs = {
      constellationName: document.getElementById('constellation-name'),
      constellationMeta: document.getElementById('constellation-meta'),
      starName: document.getElementById('star-name'),
      starMeta: document.getElementById('star-meta'),
      status: document.getElementById('status')
    };

    this._initDesktopLook();
    this._initHudPanel();
    this._initControllers();
    this._tuneVisibilityForQuest();
    this._bindEvents();
    this._selectConstellationByIndex(0);

    this.renderer.setAnimationLoop(this._render.bind(this));

    // Surface WebGL context loss rather than silently going white.
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      var box = document.getElementById('error-box');
      if (box) { box.style.display = 'block'; box.textContent = 'WebGL context lost — try reloading the page.'; }
    });
  }

  _attachVrButton() {
    var vrButtonApi =
      (typeof VRButton !== 'undefined' && VRButton && typeof VRButton.createButton === 'function')
        ? VRButton
        : (THREE.VRButton && typeof THREE.VRButton.createButton === 'function' ? THREE.VRButton : null);

    if (vrButtonApi) {
      document.body.appendChild(vrButtonApi.createButton(this.renderer));
      return;
    }

    var status = document.getElementById('status');
    if (status) {
      status.textContent = 'VR button helper did not load. Desktop preview still works, but immersive mode is unavailable until the helper script loads.';
    }
  }

  _initDesktopLook() {
    this.desktopYaw = 0;
    this.desktopPitch = 0;
    this.dragging = false;
    this.lastPointer = { x: 0, y: 0 };
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.domElement.addEventListener('pointerdown', e => {
      this.dragging = true;
      this.lastPointer = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });

    window.addEventListener('pointermove', e => {
      if (!this.dragging || this.renderer.xr.isPresenting) return;
      const dx = e.clientX - this.lastPointer.x;
      const dy = e.clientY - this.lastPointer.y;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      this.desktopYaw -= dx * 0.004;
      this.desktopPitch = THREE.MathUtils.clamp(this.desktopPitch - dy * 0.004, -1.2, 1.2);
    });
  }

  _initHudPanel() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    this.hudCanvas = canvas;
    this.hudCtx = canvas.getContext('2d');
    this.hudTexture = new THREE.CanvasTexture(canvas);
    this.hudTexture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: this.hudTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false
    });
    const geometry = new THREE.PlaneGeometry(1.35, 0.675);
    this.hudPanel = new THREE.Mesh(geometry, material);
    this.hudPanel.position.set(0, 0, -1.8);
    this.hudPanel.renderOrder = 1000;
    this.camera.add(this.hudPanel);
    this.scene.add(this.camera);
    this._drawHud();
  }

  _initControllers() {
    this.controllers = [];
    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.userData.index = i;
      controller.addEventListener('selectstart', () => this._selectHoveredStar(controller));
      controller.addEventListener('squeezestart', () => this._cycleConstellation());

      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);
      const line = new THREE.Line(
        lineGeom,
        new THREE.LineBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.85 })
      );
      line.name = 'ray';
      line.scale.z = 8;
      controller.add(line);
      this.scene.add(controller);
      this.controllers.push(controller);
    }
  }

  _tuneVisibilityForQuest() {
    this.scene.traverse(obj => {
      if (obj.isSprite && obj.userData.star) {
        obj.scale.multiplyScalar(1.8);
        obj.material.opacity = 0.95;
      }

      if (obj.isLineSegments && obj.material) {
        obj.material.opacity = Math.max(obj.material.opacity || 0, 0.65);
        obj.material.transparent = true;
      }

      if (obj.isPoints && obj.material) {
        obj.material.size = 6;
        obj.material.opacity = 0.32;
        obj.material.transparent = true;
      }
    });

    for (const id of this.constellationIds) {
      const constellation = this.sky.getConstellation(id);
      if (constellation && constellation.label && constellation.label.material) {
        constellation.label.scale.multiplyScalar(1.2);
        constellation.label.material.opacity = Math.max(constellation.label.material.opacity || 0, 0.78);
      }
    }
  }

  _getCurrentConstellation() {
    return this.sky.getConstellation(this.constellationIds[this.activeIndex]);
  }

  _selectConstellationByIndex(index) {
    this.activeIndex = (index + this.constellationIds.length) % this.constellationIds.length;
    const id = this.constellationIds[this.activeIndex];
    const constellation = this.sky.getConstellation(id);
    this._orientSkyToConstellation(constellation);
    this.sky.highlightOnly(id);
    this.selectedStar = null;
    this._updateOverlay();
    this._drawHud();
  }

  _orientSkyToConstellation(constellation) {
    if (!constellation) return;

    const targetDir = constellation.getApparentDirection().clone().normalize();
    const forward = new THREE.Vector3(0, 0, -1);
    const rotation = new THREE.Quaternion().setFromUnitVectors(targetDir, forward);
    this.sky.group.quaternion.copy(rotation);
  }

  _cycleConstellation() {
    this._selectConstellationByIndex(this.activeIndex + 1);
  }

  _selectHoveredStar(controller) {
    const hit = this._pickStarFromController(controller);
    if (!hit) return;
    this.selectedStar = hit.userData.star;
    this._updateOverlay();
    this._drawHud();
  }

  _pickStarFromController(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    const sprites = [];
    this.scene.traverse(obj => {
      if (obj.isSprite && obj.userData.star) sprites.push(obj);
    });

    const hits = this.raycaster.intersectObjects(sprites, false);
    return hits.length ? hits[0].object : null;
  }

  _updateHover() {
    if (!this.renderer.xr.isPresenting) {
      this.hoveredStar = null;
      return;
    }

    let hovered = null;
    for (const controller of this.controllers) {
      hovered = this._pickStarFromController(controller);
      if (hovered) break;
    }

    this.hoveredStar = hovered ? hovered.userData.star : null;
    this._drawHud();
  }

  _getStarSummary(star) {
    if (!star) {
      return {
        name: 'Aim at a star and pull the trigger.',
        meta: 'Grip cycles through constellations.'
      };
    }

    const add = CST.starAddendum ? CST.starAddendum[star.name] : null;
    const spectral = star.spectral + '-type';
    const bits = [spectral, star.dist_ly.toLocaleString() + ' ly', 'mag ' + star.mag.toFixed(2)];
    if (add && add.translation) bits.push('"' + add.translation + '"');
    return {
      name: star.name,
      meta: bits.join('  ·  ')
    };
  }

  _updateOverlay() {
    const constellation = this._getCurrentConstellation();
    const starSummary = this._getStarSummary(this.selectedStar || this.hoveredStar);
    this.overlayRefs.constellationName.textContent = constellation.name;
    this.overlayRefs.constellationMeta.textContent = 'Nearest star: ' + constellation.getNearestDistance().toLocaleString() + ' ly';
    this.overlayRefs.starName.textContent = starSummary.name;
    this.overlayRefs.starMeta.textContent = starSummary.meta;
    this.overlayRefs.status.textContent = this.renderer.xr.isPresenting
      ? 'In VR: look around naturally, trigger selects, grip advances to the next constellation.'
      : 'Desktop fallback: drag to look around. In Quest, press VR to enter immersive mode.';
  }

  _drawHud() {
    const ctx = this.hudCtx;
    const star = this.selectedStar || this.hoveredStar;
    const constellation = this._getCurrentConstellation();
    const starSummary = this._getStarSummary(star);

    ctx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    ctx.fillStyle = 'rgba(4, 10, 20, 0.72)';
    ctx.strokeStyle = 'rgba(120, 180, 255, 0.38)';
    ctx.lineWidth = 4;
    this._roundRect(ctx, 24, 24, 976, 464, 34);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(125, 196, 255, 0.96)';
    ctx.font = '700 46px sans-serif';
    ctx.fillText('Constellation Explorer VR', 64, 98);

    ctx.fillStyle = 'rgba(170, 198, 235, 0.62)';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Current Constellation', 64, 152);
    ctx.fillText('Star Focus', 64, 298);

    ctx.fillStyle = 'rgba(235, 244, 255, 0.95)';
    ctx.font = '700 54px sans-serif';
    ctx.fillText(constellation.name, 64, 214);

    ctx.fillStyle = 'rgba(170, 198, 235, 0.86)';
    ctx.font = '400 28px sans-serif';
    ctx.fillText('Nearest star: ' + constellation.getNearestDistance().toLocaleString() + ' ly', 64, 252);

    ctx.fillStyle = 'rgba(235, 244, 255, 0.95)';
    ctx.font = '700 42px sans-serif';
    this._wrapText(starSummary.name, 64, 360, 896, 48);

    ctx.fillStyle = 'rgba(170, 198, 235, 0.82)';
    ctx.font = '400 24px sans-serif';
    this._wrapText(starSummary.meta, 64, 414, 896, 34);

    ctx.fillStyle = 'rgba(170, 198, 235, 0.62)';
    ctx.font = '400 21px sans-serif';
    this._wrapText('Trigger: select star   Grip: next constellation   Headset: 360 look', 64, 472, 896, 28);

    this.hudTexture.needsUpdate = true;
    this._updateOverlay();
  }

  _wrapText(text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(/\s+/);
    let line = '';
    let cursorY = y;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (this.hudCtx.measureText(test).width > maxWidth && line) {
        this.hudCtx.fillText(line, x, cursorY);
        line = word;
        cursorY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) this.hudCtx.fillText(line, x, cursorY);
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  _render() {
    try {
      const dt = this.clock.getDelta();
      this.earth.update(dt);

      if (!this.renderer.xr.isPresenting) {
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.set(this.desktopPitch, this.desktopYaw, 0);
      }

      this._updateHover();

      // In XR the headset framebuffer height is much taller than window.innerHeight
      // (which stays at the 2D browser window height). Fall back to window.innerHeight
      // if getDrawingBufferSize returns 0 (can happen on first XR frame).
      let renderHeight = window.innerHeight;
      if (this.renderer.xr.isPresenting) {
        const buf = this.renderer.getDrawingBufferSize(this._bufferSizeTarget);
        renderHeight = buf.y > 0 ? buf.y : window.innerHeight;
      }

      const activeId = this.constellationIds[this.activeIndex];
      for (const id of this.constellationIds) {
        const constellation = this.sky.getConstellation(id);
        constellation.updateLabel(this.camera, renderHeight, id === activeId);
      }

      this.renderer.render(this.scene, this.camera);
    } catch (err) {
      // Unhandled throw would silently kill setAnimationLoop — show it instead.
      var box = document.getElementById('error-box');
      if (box && box.style.display === 'none') {
        box.style.display = 'block';
        box.textContent = 'Render error: ' + (err && err.stack ? err.stack : String(err));
      }
      // Don't rethrow — keep the loop alive so subsequent frames can recover.
    }
  }
};
