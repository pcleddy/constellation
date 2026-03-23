// App.js — Main application: wires scene, UI, animation loop
var CST = CST || {};

CST.App = class App {
  constructor() {
    this.clock = new THREE.Clock();
    this.activeConstellation = null;
    this.focusName = 'Earth';

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);

    // Camera — huge far plane for distant stars
    this.camera = new THREE.PerspectiveCamera(
      70, window.innerWidth / window.innerHeight, 0.1, 10000
    );

    // Scene
    this.scene = new THREE.Scene();

    // Components
    this.sky = new CST.Sky(this.scene);
    this.earth = new CST.Earth(this.scene);
    this.nav = new CST.Navigator(this.camera, this.renderer.domElement, this.scene);

    // Wire up star interaction
    this.nav.onStarHover = star => this._onStarHover(star);
    this.nav.onStarClick = star => this._onStarClick(star);

    // Earth mini-globe (second renderer)
    this._initGlobe();

    // UI
    this._buildUI();
    this._bindResize();
    this._bindKeys();

    // Start
    this._animate();
  }

  _buildUI() {
    const grid = document.getElementById('btn-grid');

    // Sort alphabetically
    const ids = this.sky.getIds().sort((a, b) => {
      const na = this.sky.getConstellation(a).name;
      const nb = this.sky.getConstellation(b).name;
      return na.localeCompare(nb);
    });

    for (const id of ids) {
      const c = this.sky.getConstellation(id);
      const btn = document.createElement('button');
      btn.className = 'cst-btn';
      btn.dataset.id = id;
      btn.textContent = c.name;
      btn.addEventListener('click', () => this.selectConstellation(id));
      grid.appendChild(btn);
    }

    // Help
    document.getElementById('help-btn').addEventListener('click', () => {
      document.getElementById('help-overlay').classList.toggle('active');
    });
    document.getElementById('help-close').addEventListener('click', () => {
      document.getElementById('help-overlay').classList.remove('active');
    });

    this._updateDistanceReferenceLabel();
  }

  _bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _bindKeys() {
    window.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        document.getElementById('help-overlay').classList.remove('active');
        document.getElementById('star-info').classList.remove('active');
      }
    });
  }

  _updateConstellationButtons(activeId) {
    document.querySelectorAll('.cst-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === activeId);
    });
  }

  _updateDistanceReferenceLabel() {
    const label = document.getElementById('dist-label');
    if (!label) return;
    label.textContent = 'From ' + this.focusName;
  }

  _recenterReferenceToWorldPoint(worldPoint) {
    const delta = worldPoint.clone().negate();
    this.sky.group.position.add(delta);
    this.earth.group.position.add(delta);
    this.nav.translateReference(delta);
  }

  _focusOnEarth() {
    this.nav.disableOrbit();
    const earthWorld = new THREE.Vector3();
    this.earth.group.getWorldPosition(earthWorld);
    if (earthWorld.lengthSq() > 1e-10) {
      this._recenterReferenceToWorldPoint(earthWorld);
    }
    this.focusName = 'Earth';
    this._updateDistanceReferenceLabel();
  }

  _focusOnStar(star) {
    if (!star || !star.mesh) return;

    this.nav.disableOrbit();
    const starWorld = new THREE.Vector3();
    star.mesh.getWorldPosition(starWorld);
    this._recenterReferenceToWorldPoint(starWorld);
    this.nav.enableOrbit(new THREE.Vector3(0, 0, 0), true);

    this.focusName = star.name;
    this._updateDistanceReferenceLabel();
  }

  selectConstellation(id) {
    const c = this.sky.getConstellation(id);
    if (!c) return;

    this._focusOnEarth();
    this.activeConstellation = id;
    this.sky.highlightOnly(id);
    const earthView = this._getEarthViewForDirection(c.getApparentDirection());
    this.nav.flyToConstellation(c);

    const tip = document.getElementById('hover-tip');
    tip.style.display = 'none';
    document.body.style.cursor = 'default';
    this._showConstellationInfo(c);

    this._updateGlobe(earthView);
    this._updateConstellationButtons(id);
  }

  _onStarHover(star) {
    const tip = document.getElementById('hover-tip');
    if (star) {
      tip.textContent = star.name + ' (' + star.dist_ly.toLocaleString() + ' ly)';
      tip.style.display = 'block';
      document.body.style.cursor = 'pointer';
    } else {
      tip.style.display = 'none';
      document.body.style.cursor = 'default';
    }
  }

  _showInfoPanel(info) {
    const panel = document.getElementById('star-info');
    const nameEl = document.getElementById('si-name');
    const typeEl = document.getElementById('si-type');
    const distEl = document.getElementById('si-dist');
    const etymEl = document.getElementById('si-etym');
    const descEl = document.getElementById('si-desc');
    const factsEl = document.getElementById('si-facts');

    nameEl.textContent = info.name || '';
    typeEl.textContent = info.type || '';
    typeEl.style.color = info.typeColor || 'rgba(180,200,230,0.9)';

    distEl.textContent = info.meta || '';
    distEl.style.display = info.meta ? 'block' : 'none';

    if (info.kicker) {
      etymEl.textContent = info.kicker;
      etymEl.style.display = 'block';
    } else {
      etymEl.style.display = 'none';
    }

    if (info.desc) {
      descEl.textContent = info.desc;
      descEl.style.display = 'block';
    } else {
      descEl.style.display = 'none';
    }

    factsEl.innerHTML = '';
    if (info.facts && info.facts.length) {
      for (const fact of info.facts) {
        const li = document.createElement('li');
        li.textContent = fact;
        factsEl.appendChild(li);
      }
      factsEl.style.display = 'block';
    } else {
      factsEl.style.display = 'none';
    }

    panel.classList.add('active');
  }

  _onStarClick(star) {
    const info = {
      name: star.name,
      type: star.spectral + '-type · mag ' + star.mag.toFixed(2),
      typeColor: star.getColor(),
      meta: star.dist_ly.toLocaleString() + ' light-years from Earth'
    };

    // Load addendum data if available
    const add = CST.starAddendum ? CST.starAddendum[star.name] : null;
    if (add) {
      info.kicker = add.culture + ', ' + add.yearNamed + ' · "' + add.translation + '"';
      info.desc = add.desc;
      info.facts = add.funFacts || [];
    } else {
      info.desc = 'A plotted member of this constellation in the 3D sky explorer.';
    }

    info.facts = [
      'Scene centered on this star for local exploration.',
      'Drag, two-finger swipe, or use arrow keys to orbit around it.',
      ...(info.facts || [])
    ];

    if (star.constellationId) {
      this.activeConstellation = star.constellationId;
      this.sky.highlightOnly(star.constellationId);
      this._updateConstellationButtons(star.constellationId);
    }

    this._focusOnStar(star);
    this._updateGlobe(null);
    this._showInfoPanel(info);
  }

  _showConstellationInfo(constellation) {
    const lore = CST.constellationLore ? CST.constellationLore[constellation.id] : null;
    const brightest = [...constellation.stars].sort((a, b) => a.mag - b.mag)[0];
    const nearest = Math.round(constellation.getNearestDistance());
    const median = Math.round(constellation.getMedianDistance());
    const info = {
      name: constellation.name,
      type: 'Constellation · ' + constellation.stars.length + ' mapped stars',
      typeColor: 'rgba(140,190,255,0.92)',
      meta: 'Brightest star: ' + brightest.name + ' · nearest member ' +
        nearest.toLocaleString() + ' ly · median distance ' + median.toLocaleString() + ' ly',
      desc: 'Select individual stars to see their names, types, distances, and lore.'
    };

    if (lore) {
      info.kicker = lore.culture + (lore.bestViewing ? ' · Best viewing: ' + lore.bestViewing : '');
      info.desc = lore.myth || info.desc;
      info.facts = lore.funFacts || [];
    } else {
      info.facts = [
        'Use click-and-drag to look around this region of sky.',
        'Fly forward to reveal how spread out the member stars are in 3D space.'
      ];
    }

    this._showInfoPanel(info);
  }

  _getEarthViewForDirection(direction) {
    const dir = direction.clone().normalize();
    const latRad = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
    const lonRad = Math.atan2(-dir.z, dir.x);

    return {
      direction: dir,
      latRad,
      lonRad,
      latDeg: THREE.MathUtils.radToDeg(latRad),
      lonDeg: THREE.MathUtils.radToDeg(lonRad)
    };
  }

  _initGlobe() {
    const container = document.getElementById('earth-globe');
    const size = 110;

    // Renderer
    this.globeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.globeRenderer.setSize(size, size);
    this.globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.globeRenderer.setClearColor(0x000000, 0);
    container.appendChild(this.globeRenderer.domElement);

    // Scene + camera
    this.globeScene = new THREE.Scene();
    this.globeCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    this.globeCamera.position.set(0, 0, 4.5);
    this.globeCamera.lookAt(0, 0, 0);

    // Earth sphere — procedural texture with continents
    const earthGeom = new THREE.SphereGeometry(1, 48, 48);
    const earthTex = this._makeGlobeTexture();
    const earthMat = new THREE.MeshBasicMaterial({ map: earthTex });
    this.globeEarth = new THREE.Mesh(earthGeom, earthMat);
    this.globeScene.add(this.globeEarth);

    // Atmosphere glow
    const glowGeom = new THREE.SphereGeometry(1.06, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x5daeff, transparent: true, opacity: 0.16, side: THREE.BackSide
    });
    this.globeScene.add(new THREE.Mesh(glowGeom, glowMat));

    // Equator ring
    this._addLatRing(0, 0x3366aa, 0.5);
    // Tropics
    this._addLatRing(23.44, 0x224466, 0.25);
    this._addLatRing(-23.44, 0x224466, 0.25);
    // Arctic/Antarctic
    this._addLatRing(66.56, 0x224466, 0.25);
    this._addLatRing(-66.56, 0x224466, 0.25);

    // Pole markers — small bright dots at north and south poles
    const poleMat = new THREE.SpriteMaterial({
      color: 0xaaccff, transparent: true, opacity: 0.9,
      map: this.sky.starTexture, blending: THREE.AdditiveBlending
    });
    const northPole = new THREE.Sprite(poleMat.clone());
    northPole.position.set(0, 1.05, 0);
    northPole.scale.set(0.12, 0.12, 1);
    this.globeScene.add(northPole);

    const southPole = new THREE.Sprite(poleMat.clone());
    southPole.position.set(0, -1.05, 0);
    southPole.scale.set(0.12, 0.12, 1);
    this.globeScene.add(southPole);

    // "N" label at north pole
    this._addPoleLabel('N', 0, 1.25, 0);
    this._addPoleLabel('S', 0, -1.25, 0);

    // Viewing position dot (hidden until constellation selected)
    const dotMat = new THREE.SpriteMaterial({
      color: 0xb8ecff,
      transparent: true,
      opacity: 1,
      map: this.sky.starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    });
    this.globeDot = new THREE.Sprite(dotMat);
    this.globeDot.scale.set(0.26, 0.26, 1);
    this.globeDot.visible = false;
    this.globeDot.renderOrder = 20;
    this.globeEarth.add(this.globeDot);

    const dotGlowMat = new THREE.SpriteMaterial({
      color: 0x59c8ff,
      transparent: true,
      opacity: 0.4,
      map: this.sky.starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    });
    this.globeDotGlow = new THREE.Sprite(dotGlowMat);
    this.globeDotGlow.scale.set(0.46, 0.46, 1);
    this.globeDotGlow.visible = false;
    this.globeDotGlow.renderOrder = 19;
    this.globeEarth.add(this.globeDotGlow);

    // Visibility ring around dot
    this.globeRing = null;

    // Soft ambient light
    this.globeScene.add(new THREE.AmbientLight(0xffffff, 1));

    // Target rotation for smooth lerp
    this._globeTargetRotY = 0;
  }

  _makeGlobeTexture() {
    const w = 512, h = 256;
    const can = document.createElement('canvas');
    can.width = w; can.height = h;
    const ctx = can.getContext('2d');

    // Ocean
    ctx.fillStyle = '#0c1a2e';
    ctx.fillRect(0, 0, w, h);

    // Continents (rough shapes — enough for a minimap globe)
    ctx.fillStyle = '#1a3a28';

    // North America
    ctx.beginPath();
    ctx.moveTo(60, 30); ctx.lineTo(110, 25); ctx.lineTo(130, 45);
    ctx.lineTo(115, 70); ctx.lineTo(95, 85); ctx.lineTo(80, 95);
    ctx.lineTo(75, 80); ctx.lineTo(55, 55); ctx.closePath(); ctx.fill();

    // South America
    ctx.beginPath();
    ctx.moveTo(100, 110); ctx.lineTo(120, 100); ctx.lineTo(130, 120);
    ctx.lineTo(125, 160); ctx.lineTo(115, 180); ctx.lineTo(100, 175);
    ctx.lineTo(95, 140); ctx.closePath(); ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.moveTo(240, 30); ctx.lineTo(275, 25); ctx.lineTo(280, 40);
    ctx.lineTo(270, 55); ctx.lineTo(250, 60); ctx.lineTo(240, 50);
    ctx.closePath(); ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.moveTo(245, 65); ctx.lineTo(275, 60); ctx.lineTo(290, 80);
    ctx.lineTo(285, 110); ctx.lineTo(275, 140); ctx.lineTo(260, 150);
    ctx.lineTo(250, 130); ctx.lineTo(240, 100); ctx.closePath(); ctx.fill();

    // Asia
    ctx.beginPath();
    ctx.moveTo(280, 25); ctx.lineTo(350, 20); ctx.lineTo(400, 30);
    ctx.lineTo(420, 50); ctx.lineTo(410, 65); ctx.lineTo(380, 80);
    ctx.lineTo(350, 85); ctx.lineTo(320, 75); ctx.lineTo(290, 60);
    ctx.lineTo(280, 45); ctx.closePath(); ctx.fill();

    // India
    ctx.beginPath();
    ctx.moveTo(335, 85); ctx.lineTo(350, 80); ctx.lineTo(355, 105);
    ctx.lineTo(340, 115); ctx.lineTo(330, 100); ctx.closePath(); ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.moveTo(400, 130); ctx.lineTo(440, 125); ctx.lineTo(455, 140);
    ctx.lineTo(445, 160); ctx.lineTo(420, 162); ctx.lineTo(400, 150);
    ctx.closePath(); ctx.fill();

    // Antarctica hint
    ctx.fillStyle = '#2a3a4a';
    ctx.fillRect(0, 235, w, 21);

    // Greenland
    ctx.fillStyle = '#1a3a28';
    ctx.beginPath();
    ctx.moveTo(140, 18); ctx.lineTo(165, 15); ctx.lineTo(170, 30);
    ctx.lineTo(155, 40); ctx.lineTo(138, 32); ctx.closePath(); ctx.fill();

    // Ice caps
    ctx.fillStyle = 'rgba(180,200,220,0.15)';
    ctx.fillRect(0, 0, w, 12);
    ctx.fillRect(0, 244, w, 12);

    const tex = new THREE.CanvasTexture(can);
    tex.wrapS = THREE.RepeatWrapping;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  _addLatRing(latDeg, color, opacity) {
    const phi = latDeg * Math.PI / 180;
    const r = Math.cos(phi) * 1.01;
    const y = Math.sin(phi) * 1.01;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    this.globeScene.add(new THREE.Line(geom, mat));
  }

  _addPoleLabel(text, x, y, z) {
    const can = document.createElement('canvas');
    can.width = 32; can.height = 32;
    const ctx = can.getContext('2d');
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(150,190,255,0.8)';
    ctx.fillText(text, 16, 16);
    const tex = new THREE.CanvasTexture(can);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.3, 0.3, 1);
    this.globeScene.add(sprite);
  }

  _updateGlobe(info) {
    if (!info) {
      this.globeDot.visible = false;
      if (this.globeDotGlow) this.globeDotGlow.visible = false;
      if (this.globeRing) this.globeRing.visible = false;
      this._globeInfo = null;
      return;
    }

    // Store for use in _animate (freeze check, dot orientation)
    this._globeInfo = info;

    const R = 1.08; // just above surface
    const surfacePoint = info.direction.clone().normalize().multiplyScalar(R);
    this.globeDot.position.copy(surfacePoint);
    this.globeDot.visible = true;
    if (this.globeDotGlow) {
      this.globeDotGlow.position.copy(this.globeDot.position);
      this.globeDotGlow.visible = true;
    }

    // Rotate the whole globe so the selected Earth-facing point faces the viewer.
    this._globeTargetRotY = -Math.atan2(surfacePoint.x, surfacePoint.z);

    // Visibility ring
    if (this.globeRing) this.globeEarth.remove(this.globeRing);
    const ringPts = [];
    const ringR = 0.35; // angular radius on sphere
    const centerDir = surfacePoint.clone().normalize();
    let tangent = new THREE.Vector3(0, 1, 0).cross(centerDir);
    if (tangent.lengthSq() < 1e-6) {
      tangent = new THREE.Vector3(1, 0, 0).cross(centerDir);
    }
    tangent.normalize();
    const bitangent = centerDir.clone().cross(tangent).normalize();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const ringPoint = centerDir.clone().multiplyScalar(Math.cos(ringR))
        .addScaledVector(tangent, Math.sin(ringR) * Math.cos(a))
        .addScaledVector(bitangent, Math.sin(ringR) * Math.sin(a))
        .normalize()
        .multiplyScalar(1.05);
      ringPts.push(ringPoint);
    }
    const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPts);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x9fe4ff,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      depthTest: false
    });
    this.globeRing = new THREE.Line(ringGeom, ringMat);
    this.globeRing.renderOrder = 18;
    this.globeEarth.add(this.globeRing);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.nav.update(dt);
    this.earth.update(dt);

    // Keep constellation labels readable without letting them fill the screen
    const viewportHeight = this.renderer.domElement.clientHeight || window.innerHeight;
    for (const c of Object.values(this.sky.constellations)) {
      c.updateLabel(this.camera, viewportHeight, c.id === this.activeConstellation);
    }

    // Speed HUD — rounded to nearest 0.25 ly/yr (c)
    const speedC = this.nav.getSpeedC();
    const rounded = Math.round(speedC * 4) / 4; // round to quarter
    const hud = document.getElementById('speed-val');
    if (rounded < 0.25) {
      hud.textContent = 'Stationary';
    } else if (rounded < 1) {
      hud.textContent = rounded.toFixed(2) + 'c';
    } else if (rounded < 100) {
      hud.textContent = rounded.toFixed(1) + 'c';
    } else if (rounded < 1000) {
      hud.textContent = Math.round(rounded).toLocaleString() + 'c';
    } else if (rounded < 1e6) {
      hud.textContent = (rounded / 1000).toFixed(1) + 'k c';
    } else {
      hud.textContent = (rounded / 1e6).toFixed(1) + 'M c';
    }

    // Distance from Earth
    const distLy = this.nav.getDistFromEarth();
    const distEl = document.getElementById('dist-val');
    if (distLy < 0.01) {
      distEl.textContent = (distLy * 63241).toFixed(0) + ' AU';
    } else if (distLy < 1) {
      distEl.textContent = (distLy * 63241).toFixed(0) + ' AU';
    } else if (distLy < 1000) {
      distEl.textContent = distLy.toFixed(1) + ' ly';
    } else {
      distEl.textContent = (distLy / 1000).toFixed(2) + 'k ly';
    }

    this.renderer.render(this.scene, this.camera);

    // Render mini-globe
    if (this.globeEarth) {
      this.globeEarth.material.opacity = 1;
      this.globeEarth.material.transparent = false;
      if (this.globeDot) this.globeDot.material.opacity = 1;
      if (this.globeDotGlow) this.globeDotGlow.material.opacity = 0.4;
      if (this.globeRing) this.globeRing.material.opacity = 0.82;

      if (this._globeInfo) {
        this.globeEarth.rotation.y += (this._globeTargetRotY - this.globeEarth.rotation.y) * 0.08;
      } else {
        this.globeEarth.rotation.y += 0.001;
      }

      // Tilt slightly for better view
      this.globeEarth.rotation.x = 0.15;
      this.globeRenderer.render(this.globeScene, this.globeCamera);
    }
  }
};
