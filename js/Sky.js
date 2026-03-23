// Sky.js — Manages all constellations and background starfield
var CST = CST || {};

CST.Sky = class Sky {
  constructor(scene) {
    this.scene = scene;
    this.constellations = {};
    this.group = new THREE.Group();
    this.starTexture = this._makeStarTexture();
    this._buildConstellations();
    this._buildBackground();
    scene.add(this.group);
  }

  _makeStarTexture() {
    const can = document.createElement('canvas');
    can.width = 64; can.height = 64;
    const ctx = can.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.15, 'rgba(255,255,255,0.7)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(can);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  _buildConstellations() {
    for (const data of CST.constellations) {
      const c = new CST.Constellation(data, this.starTexture);
      this.constellations[data.id] = c;
      this.group.add(c.group);
    }
  }

  _buildBackground() {
    // Background stars on a very distant sphere (visual backdrop)
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const R = 5000; // far away — constant backdrop

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1) - Math.PI / 2;
      positions[i * 3]     = R * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = R * Math.sin(phi);
      positions[i * 3 + 2] = -R * Math.cos(phi) * Math.sin(theta);

      const dim = 0.25 + Math.random() * 0.45;
      colors[i * 3] = dim;
      colors[i * 3 + 1] = dim;
      colors[i * 3 + 2] = dim + Math.random() * 0.15;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    this.group.add(new THREE.Points(geom, mat));
  }

  getConstellation(id) {
    return this.constellations[id] || null;
  }

  highlightOnly(id) {
    for (const [cid, c] of Object.entries(this.constellations)) {
      c.highlight(cid === id);
    }
  }

  showAll() {
    for (const c of Object.values(this.constellations)) {
      c.highlight(false);
    }
  }

  getIds() {
    return Object.keys(this.constellations);
  }
};
