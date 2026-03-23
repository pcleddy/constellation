// Constellation.js — Group of stars with connecting lines and label
var CST = CST || {};

CST.Constellation = class Constellation {
  constructor(data, starTexture) {
    this.id = data.id;
    this.name = data.name;
    this.stars = data.stars.map(s => new CST.Star(s));
    this.lineIndices = data.lines;
    this.group = new THREE.Group();
    this.group.name = this.id;
    this.linesMesh = null;
    this.label = null;
    this._dimOpacity = 0.35;
    this._brightOpacity = 0.85;
    this._labelWorldPos = new THREE.Vector3();
    this._build(starTexture);
  }

  _build(starTexture) {
    // Stars
    for (const star of this.stars) {
      star.constellationId = this.id;
      star.constellationName = this.name;
      this.group.add(star.createSprite(starTexture));
    }

    // Lines connecting stars (across real 3D depth)
    const positions = [];
    for (const [a, b] of this.lineIndices) {
      const pa = this.stars[a].position;
      const pb = this.stars[b].position;
      positions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.linesMesh = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({
      color: 0x648cc8,
      transparent: true,
      opacity: this._dimOpacity,
      depthWrite: false
    }));
    this.group.add(this.linesMesh);

    // Label at the "apparent" centroid direction, placed at median distance
    this.label = this._makeLabel();
    this.group.add(this.label);
  }

  _makeLabel() {
    const can = document.createElement('canvas');
    const ctx = can.getContext('2d');
    ctx.font = 'bold 28px sans-serif';
    const tw = Math.max(128, Math.ceil(ctx.measureText(this.name).width) + 24);
    can.width = tw; can.height = 40;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(150,190,255,0.85)';
    ctx.fillText(this.name, tw / 2, 20);

    const tex = new THREE.CanvasTexture(can);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);

    // Keep nearby constellation labels off the Earth's surface so they stay
    // readable and don't fade the moment the camera starts moving.
    const dir = this.getApparentDirection();
    const nearDist = this.getNearestDistance();
    const placeDist = Math.max(16, nearDist * 0.75);
    const basePos = dir.clone().multiplyScalar(placeDist);

    // Offset above the highest star (projected to the same distance shell)
    let maxY = -Infinity;
    for (const s of this.stars) {
      const projected = s.position.clone().normalize().multiplyScalar(placeDist);
      if (projected.y > maxY) maxY = projected.y;
    }
    const labelOffset = Math.max(0.8, placeDist * 0.03);
    basePos.y = maxY + labelOffset;

    sprite.position.copy(basePos);

    const aspect = tw / 40;
    sprite.scale.set(aspect * 1.2, 1.2, 1);

    // Store metadata for distance-aware sizing and fading.
    sprite.userData.isConstellationLabel = true;
    sprite.userData.aspect = aspect;
    sprite.userData.baseDist = nearDist;
    sprite.userData.placeDist = placeDist;

    return sprite;
  }

  _updateLabelScale(camera, viewportHeight, isActive) {
    this.label.getWorldPosition(this._labelWorldPos);
    const dist = camera.position.distanceTo(this._labelWorldPos);
    const aspect = this.label.userData.aspect || 3;
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const worldUnitsPerPx = (2 * dist * Math.tan(fovRad / 2)) / viewportHeight;
    const targetHeightPx = isActive ? 34 : 26;
    const labelHeight = THREE.MathUtils.clamp(targetHeightPx * worldUnitsPerPx, 1.2, 80);

    this.label.scale.set(aspect * labelHeight, labelHeight, 1);
  }

  _updateLabelOpacity(cameraPos, isActive) {
    if (!this.label) return;
    this.label.getWorldPosition(this._labelWorldPos);
    const d = cameraPos.distanceTo(this._labelWorldPos);
    const baseDist = this.label.userData.baseDist || 100;
    const fullOpacity = isActive ? 0.92 : 0.58;
    // Let the active label stay readable while approaching the stars, and only
    // fade it when the camera is truly inside the constellation.
    const fadeStart = Math.max(10, baseDist * 0.16);
    const fadeEnd = Math.max(4, baseDist * 0.06);

    let opacity = fullOpacity;
    if (d <= fadeEnd) {
      opacity = 0;
    } else if (d < fadeStart) {
      opacity = fullOpacity * ((d - fadeEnd) / (fadeStart - fadeEnd));
    }

    this.label.material.opacity = opacity;
  }

  updateLabel(camera, viewportHeight, isActive) {
    if (!this.label) return;
    this._updateLabelScale(camera, viewportHeight, isActive);
    this._updateLabelOpacity(camera.position, isActive);
  }

  // Centroid in 3D space (actual positions with depth)
  getCentroid() {
    const c = new THREE.Vector3();
    for (const s of this.stars) c.add(s.position);
    c.divideScalar(this.stars.length);
    return c;
  }

  // Apparent direction from origin (for camera targeting — as seen from Earth)
  getApparentDirection() {
    const dir = new THREE.Vector3();
    for (const s of this.stars) dir.add(s.getDirection());
    dir.divideScalar(this.stars.length).normalize();
    return dir;
  }

  // Median distance of stars (for camera positioning)
  getMedianDistance() {
    const dists = this.stars.map(s => s.dist_ly).sort((a, b) => a - b);
    const mid = Math.floor(dists.length / 2);
    return dists.length % 2 ? dists[mid] : (dists[mid - 1] + dists[mid]) / 2;
  }

  // Nearest star distance (for initial view positioning)
  getNearestDistance() {
    return Math.min(...this.stars.map(s => s.dist_ly));
  }

  highlight(on) {
    const opacity = on ? this._brightOpacity : this._dimOpacity;
    const lineColor = on ? 0x64b4ff : 0x648cc8;
    this.linesMesh.material.opacity = opacity;
    this.linesMesh.material.color.setHex(lineColor);
    for (const star of this.stars) {
      if (star.mesh) {
        const baseSize = star.getSize();
        const scale = on ? baseSize * 1.3 : baseSize;
        star.mesh.scale.set(scale, scale, 1);
      }
    }
  }
};
