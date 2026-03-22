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
    this.overlayMesh = null;
    this._build(starTexture);
  }

  _build(starTexture) {
    // Stars
    for (const star of this.stars) {
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

    // Place label in front of the constellation (at nearest star distance × 0.7)
    const dir = this.getApparentDirection();
    const nearDist = this.getNearestDistance();
    const placeDist = nearDist * 0.7;
    const basePos = dir.clone().multiplyScalar(placeDist);

    // Offset above the highest star (projected to the same distance shell)
    let maxY = -Infinity;
    for (const s of this.stars) {
      const projected = s.position.clone().normalize().multiplyScalar(placeDist);
      if (projected.y > maxY) maxY = projected.y;
    }
    const labelOffset = Math.max(0.5, placeDist * 0.04);
    basePos.y = maxY + labelOffset;

    sprite.position.copy(basePos);

    // Scale based on placement distance so all labels subtend a similar
    // angular size from Earth. The factor 0.008 gives readable but
    // unobtrusive labels; cap prevents extreme sizes.
    const aspect = tw / 40;
    const labelScale = Math.min(3.0, Math.max(0.3, placeDist * 0.008));
    sprite.scale.set(aspect * labelScale, labelScale, 1);

    // Store for distance-based fading
    sprite.userData.isConstellationLabel = true;
    sprite.userData.baseDist = nearDist;

    return sprite;
  }

  // Called each frame by App to fade labels based on camera distance
  updateLabelOpacity(cameraPos) {
    if (!this.label) return;
    const d = cameraPos.distanceTo(this.label.position);
    const baseDist = this.label.userData.baseDist || 100;
    // Fade out when closer than 40% of base distance, fully transparent at 15%
    const fadeStart = baseDist * 0.5;
    const fadeEnd = baseDist * 0.15;
    let opacity;
    if (d > fadeStart) {
      opacity = 0.85;
    } else if (d < fadeEnd) {
      opacity = 0;
    } else {
      opacity = 0.85 * (d - fadeEnd) / (fadeStart - fadeEnd);
    }
    this.label.material.opacity = opacity;
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

  _buildOverlay() {
    // Create a semi-transparent filled shape connecting outermost stars
    // Uses convex hull of star directions projected onto a plane
    if (this.stars.length < 3) return null;

    const centroid = this.getCentroid();
    const dir = this.getApparentDirection();
    const medDist = this.getMedianDistance();

    // Build a shape from star positions
    const positions = [];
    // Use all star positions to create a filled mesh
    for (let i = 0; i < this.lineIndices.length; i++) {
      const [a, b] = this.lineIndices[i];
      const pa = this.stars[a].position;
      const pb = this.stars[b].position;
      const pc = centroid;
      // Triangle fan: centroid → each line endpoint pair
      positions.push(pc.x, pc.y, pc.z);
      positions.push(pa.x, pa.y, pa.z);
      positions.push(pb.x, pb.y, pb.z);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: 0x4488cc,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.visible = false;
    return mesh;
  }

  toggleOverlay(show) {
    if (!this.overlayMesh && show) {
      this.overlayMesh = this._buildOverlay();
      if (this.overlayMesh) this.group.add(this.overlayMesh);
    }
    if (this.overlayMesh) {
      this.overlayMesh.visible = show;
    }
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
