// Earth.js — Blue sphere at origin with glow
var CST = CST || {};

CST.Earth = class Earth {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this._build();
    scene.add(this.group);
  }

  _build() {
    // Main sphere — procedural blue/green
    const geom = new THREE.SphereGeometry(2, 48, 48);
    const can = document.createElement('canvas');
    can.width = 256; can.height = 128;
    const ctx = can.getContext('2d');

    // Ocean base
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(0, 0, 256, 128);

    // Simple continent blobs
    ctx.fillStyle = '#2a5a3a';
    const continents = [
      [60, 35, 30, 20],  [100, 30, 15, 15], [140, 55, 20, 18],
      [170, 40, 25, 25], [55, 70, 12, 10],  [195, 35, 18, 22],
      [220, 65, 22, 20], [30, 25, 18, 14]
    ];
    for (const [x, y, w, h] of continents) {
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ice caps
    ctx.fillStyle = 'rgba(220,230,240,0.6)';
    ctx.fillRect(0, 0, 256, 8);
    ctx.fillRect(0, 120, 256, 8);

    const tex = new THREE.CanvasTexture(can);
    tex.wrapS = THREE.RepeatWrapping;
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.sphere = new THREE.Mesh(geom, mat);
    this.group.add(this.sphere);

    // Atmosphere glow
    const glowGeom = new THREE.SphereGeometry(2.15, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4488cc,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    this.group.add(new THREE.Mesh(glowGeom, glowMat));
  }

  update(dt) {
    this.sphere.rotation.y += dt * 0.02;
  }
};
