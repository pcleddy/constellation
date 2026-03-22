// Star.js — Individual star positioned at real distance from Earth
var CST = CST || {};

// Scale: 1 unit = 1 light-year
// Stars positioned by RA/Dec direction × actual distance
CST.DIST_SCALE = 1; // 1 unit = 1 ly

CST.Star = class Star {
  constructor(data) {
    this.name = data.name;
    this.ra = data.ra;       // decimal hours
    this.dec = data.dec;     // decimal degrees
    this.mag = data.mag;
    this.spectral = data.spectral || 'A';
    this.dist_ly = data.dist_ly || 100;  // fallback
    this.position = this._calcPosition();
    this.mesh = null;        // set by createSprite
  }

  _calcPosition() {
    const R = this.dist_ly * CST.DIST_SCALE;
    const theta = this.ra * (2 * Math.PI / 24);
    const phi = this.dec * (Math.PI / 180);
    return new THREE.Vector3(
      R * Math.cos(phi) * Math.cos(theta),
      R * Math.sin(phi),
      -R * Math.cos(phi) * Math.sin(theta)
    );
  }

  // Direction from origin (for "apparent" position on sky)
  getDirection() {
    return this.position.clone().normalize();
  }

  getColor() {
    return CST.SPECTRAL_COLORS[this.spectral] || '#ffffff';
  }

  // Size scales with brightness but also distance (so distant stars don't vanish)
  getSize() {
    // Absolute size: brighter = bigger (gentler range)
    const magSize = Math.max(0.15, 1.2 - this.mag * 0.15);
    // Scale up with distance so very far stars remain visible from Earth
    const distScale = Math.max(1, Math.sqrt(this.dist_ly / 80));
    // Cap so no star sprite dominates the sky (prevents Sirius-sized hitboxes)
    return Math.min(1.5, magSize * distScale);
  }

  createSprite(texture) {
    const mat = new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(this.getColor()),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(this.position);
    const s = this.getSize();
    sprite.scale.set(s, s, 1);
    sprite.userData.star = this;
    this.mesh = sprite;
    return sprite;
  }
};
