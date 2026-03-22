// App.js — Main application: wires scene, UI, animation loop
var CST = CST || {};

CST.App = class App {
  constructor() {
    this.clock = new THREE.Clock();
    this.activeConstellation = null;

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
      // O = toggle constellation figure overlays
      if (e.code === 'KeyO' && !e.target.closest('input, textarea')) {
        this.showOverlays = !this.showOverlays;
        this.sky.toggleOverlays(this.showOverlays);
      }
    });
    this.showOverlays = false;
  }

  selectConstellation(id) {
    const c = this.sky.getConstellation(id);
    if (!c) return;

    this.activeConstellation = id;
    this.sky.highlightOnly(id);
    this.nav.flyToConstellation(c);

    // Show constellation lore if available
    this._showConstellationLore(id);

    // Update Earth mini-globe — show best viewing latitude
    let avgRA = 0, avgDecDeg = 0;
    for (const s of c.stars) { avgRA += s.ra; avgDecDeg += s.dec; }
    avgRA /= c.stars.length;
    avgDecDeg /= c.stars.length;
    this._updateGlobe({ ra: avgRA, dec: avgDecDeg });

    // Update buttons
    document.querySelectorAll('.cst-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
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

  _onStarClick(star) {
    const panel = document.getElementById('star-info');
    const nameEl = document.getElementById('si-name');
    const typeEl = document.getElementById('si-type');
    const distEl = document.getElementById('si-dist');
    const etymEl = document.getElementById('si-etym');
    const descEl = document.getElementById('si-desc');
    const factsEl = document.getElementById('si-facts');

    nameEl.textContent = star.name;
    typeEl.textContent = star.spectral + '-type · mag ' + star.mag.toFixed(2);
    typeEl.style.color = star.getColor();
    distEl.textContent = star.dist_ly.toLocaleString() + ' light-years from Earth';

    // Load addendum data if available
    const add = CST.starAddendum ? CST.starAddendum[star.name] : null;
    if (add) {
      etymEl.textContent = add.culture + ', ' + add.yearNamed + ' · "' + add.translation + '"';
      etymEl.style.display = 'block';
      descEl.textContent = add.desc;
      descEl.style.display = 'block';
      factsEl.innerHTML = '';
      if (add.funFacts && add.funFacts.length) {
        for (const fact of add.funFacts) {
          const li = document.createElement('li');
          li.textContent = fact;
          factsEl.appendChild(li);
        }
        factsEl.style.display = 'block';
      } else {
        factsEl.style.display = 'none';
      }
    } else {
      etymEl.style.display = 'none';
      descEl.style.display = 'none';
      factsEl.style.display = 'none';
    }

    panel.classList.add('active');
  }

  _showConstellationLore(id) {
    if (!CST.constellationLore) return;
    const lore = CST.constellationLore[id];
    if (!lore) return;
    // Could show in a separate panel — for now, brief display in hover tip
    const tip = document.getElementById('hover-tip');
    tip.textContent = lore.bestViewing || '';
    tip.style.display = lore.bestViewing ? 'block' : 'none';
    setTimeout(() => { if (tip.textContent === lore.bestViewing) tip.style.display = 'none'; }, 3000);
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
      color: 0x4488cc, transparent: true, opacity: 0.1, side: THREE.BackSide
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
      color: 0x44aaff, transparent: true, opacity: 0.95,
      map: this.sky.starTexture, blending: THREE.AdditiveBlending
    });
    this.globeDot = new THREE.Sprite(dotMat);
    this.globeDot.scale.set(0.18, 0.18, 1);
    this.globeDot.visible = false;
    this.globeScene.add(this.globeDot);

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
      if (this.globeRing) this.globeRing.visible = false;
      this._globeInfo = null;
      return;
    }

    // Store for use in _animate (freeze check, dot orientation)
    this._globeInfo = info;

    // Place dot on globe surface at latitude = dec, longitude derived from RA
    // RA hours → longitude: lon = -(RA / 24) * 360 (negative because RA goes east)
    const latRad = info.dec * Math.PI / 180;
    const lonRad = -(info.ra / 24) * Math.PI * 2;
    const R = 1.08; // just above surface
    this.globeDot.position.set(
      R * Math.cos(latRad) * Math.sin(lonRad),
      R * Math.sin(latRad),
      R * Math.cos(latRad) * Math.cos(lonRad)
    );
    this.globeDot.visible = true;

    // Rotate globe so the dot faces the camera (toward the viewer)
    // Use the dot's longitude to rotate the globe so it's front-facing
    this._globeTargetRotY = -lonRad + Math.PI; // +PI to face toward camera, not away

    // Visibility ring
    if (this.globeRing) this.globeScene.remove(this.globeRing);
    const ringPts = [];
    const ringR = 0.35; // angular radius on sphere
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      // Small circle on sphere around the point
      const dx = ringR * Math.cos(a);
      const dy = ringR * Math.sin(a);
      const lat2 = latRad + dy;
      const lon2 = lonRad + dx / Math.cos(latRad + 0.001);
      ringPts.push(new THREE.Vector3(
        1.05 * Math.cos(lat2) * Math.sin(lon2),
        1.05 * Math.sin(lat2),
        1.05 * Math.cos(lat2) * Math.cos(lon2)
      ));
    }
    const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPts);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x44aaff, transparent: true, opacity: 0.3, depthWrite: false
    });
    this.globeRing = new THREE.Line(ringGeom, ringMat);
    this.globeScene.add(this.globeRing);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.nav.update(dt);
    this.earth.update(dt);

    // Fade constellation labels based on camera proximity
    const camPos = this.nav.position;
    for (const c of Object.values(this.sky.constellations)) {
      c.updateLabelOpacity(camPos);
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
      const distFromEarth = this.nav.getDistFromEarth();

      if (distFromEarth > 1) {
        // Beyond 1 ly: freeze globe, dim it slightly to indicate "out of range"
        if (!this._globeFrozen) {
          this._globeFrozen = true;
          this.globeEarth.material.opacity = 0.4;
          this.globeEarth.material.transparent = true;
          if (this.globeDot) this.globeDot.material.opacity = 0.3;
          if (this.globeRing) this.globeRing.material.opacity = 0.1;
        }
      } else {
        // Near Earth: active globe
        if (this._globeFrozen) {
          this._globeFrozen = false;
          this.globeEarth.material.opacity = 1;
          this.globeEarth.material.transparent = false;
          if (this.globeDot) this.globeDot.material.opacity = 0.95;
          if (this.globeRing) this.globeRing.material.opacity = 0.3;
        }
        // Smooth lerp to target rotation (dot faces viewer)
        this.globeEarth.rotation.y += (this._globeTargetRotY - this.globeEarth.rotation.y) * 0.05;
      }

      // Gentle idle spin (always, even when frozen — keeps it feeling alive)
      this.globeEarth.rotation.y += 0.001;
      // Tilt slightly for better view
      this.globeEarth.rotation.x = 0.15;
      this.globeRenderer.render(this.globeScene, this.globeCamera);
    }
  }
};
