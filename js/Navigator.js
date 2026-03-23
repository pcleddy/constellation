// Navigator.js — Camera controls: fly (WASD), orbit (trackpad), roll, star picking
var CST = CST || {};

CST.Navigator = class Navigator {
  constructor(camera, domElement, scene) {
    this.camera = camera;
    this.dom = domElement;
    this.scene = scene;
    this.keys = {};

    // Orientation (Euler angles)
    this.yaw = 0;
    this.pitch = 0.3;
    this.roll = 0;
    this.targetYaw = 0;
    this.targetPitch = 0.3;
    this.targetRoll = 0;

    // Position (starts at origin, slightly above Earth)
    this.position = new THREE.Vector3(0, 3, 0);
    this.targetPosition = this.position.clone();

    // Movement speed (light-years per second) — 5 ly/s base, 20 ly/s with shift
    this.moveSpeed = 5;
    this.currentSpeed = 0;
    this._prevPos = this.position.clone();

    // Pointer state for screen-space star interaction
    this.pointerPx = new THREE.Vector2(-1, -1);
    this.hoveredStar = null;
    this.onStarHover = null;   // callback(star) or null
    this.onStarClick = null;   // callback(star) or null

    // Drag state
    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };

    this._bindEvents();
  }

  _bindEvents() {
    // Keyboard
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });

    // Mouse drag = orbit (left button) / roll (right button or shift+drag)
    this.dom.addEventListener('mousedown', e => {
      if (e.target.closest('#controls, #help-overlay, #speed-hud, #star-info')) return;
      this.dragging = true;
      this._dragButton = e.button;
      this._shiftDrag = e.shiftKey;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { this.dragging = false; });
    window.addEventListener('mousemove', e => {
      this._updatePointer(e.clientX, e.clientY);

      if (!this.dragging) return;
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.lastMouse = { x: e.clientX, y: e.clientY };

      if (this._shiftDrag || this._dragButton === 2) {
        // Shift+drag or right-drag = roll
        this.targetRoll += dx * 0.003;
      } else {
        // Normal drag = yaw/pitch
        const flip = Math.cos(this.targetPitch) < 0 ? -1 : 1;
        this.targetYaw -= dx * 0.003 * flip;
        this.targetPitch += dy * 0.003;
      }
    });

    // Prevent context menu on right-click (for roll)
    this.dom.addEventListener('contextmenu', e => e.preventDefault());

    // Click = select star
    this.dom.addEventListener('click', e => {
      if (e.target.closest('#controls, #help-overlay, #speed-hud, #star-info')) return;
      this._updatePointer(e.clientX, e.clientY);
      this._checkStarClick();
    });

    // Scroll = move forward/back
    this.dom.addEventListener('wheel', e => {
      e.preventDefault();
      const fwd = this._forwardVec();
      const speed = Math.max(1, this.moveSpeed * 0.3);
      this.targetPosition.addScaledVector(fwd, -e.deltaY * 0.005 * speed);
    }, { passive: false });

    // Touch support
    let _pinchDist = 0;
    this.dom.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        this.dragging = true;
        this._updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.dragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        _pinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });

    this.dom.addEventListener('touchmove', e => {
      e.preventDefault();
      if (e.touches.length === 1 && this.dragging) {
        this._updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        const dx = e.touches[0].clientX - this.lastMouse.x;
        const dy = e.touches[0].clientY - this.lastMouse.y;
        const flip = Math.cos(this.targetPitch) < 0 ? -1 : 1;
        this.targetYaw -= dx * 0.004 * flip;
        this.targetPitch += dy * 0.004;
        this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (_pinchDist > 0) {
          const fwd = this._forwardVec();
          const delta = (dist - _pinchDist) * 0.5;
          this.targetPosition.addScaledVector(fwd, delta);
        }
        _pinchDist = dist;
      }
    }, { passive: false });

    this.dom.addEventListener('touchend', () => {
      this.dragging = false;
      _pinchDist = 0;
    }, { passive: true });
  }

  _updatePointer(clientX, clientY) {
    const rect = this.dom.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.pointerPx.set(x, y);
  }

  _forwardVec() {
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyEuler(new THREE.Euler(this.pitch, this.yaw, this.roll, 'YXZ'));
    return dir;
  }

  _rightVec() {
    const dir = new THREE.Vector3(1, 0, 0);
    dir.applyEuler(new THREE.Euler(this.pitch, this.yaw, this.roll, 'YXZ'));
    return dir;
  }

  _upVec() {
    const dir = new THREE.Vector3(0, 1, 0);
    dir.applyEuler(new THREE.Euler(this.pitch, this.yaw, this.roll, 'YXZ'));
    return dir;
  }

  _getStarPickRadiusPx(sprite, viewportHeight) {
    const spriteSize = sprite.scale.x || sprite.userData.star.getSize();
    const distToCamera = this.camera.position.distanceTo(sprite.position);
    if (distToCamera <= 0) return 18;

    const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
    const projectedRadiusPx =
      (spriteSize * viewportHeight) / (4 * distToCamera * Math.tan(fovRad / 2));

    // Give tiny distant stars a reasonable click target, but keep nearby
    // bright stars from growing into giant invisible blockers.
    return THREE.MathUtils.clamp(projectedRadiusPx * 1.75, 10, 18);
  }

  _pickStarByScreenSpace() {
    const rect = this.dom.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    if (this.pointerPx.x < 0 || this.pointerPx.y < 0) return null;

    let bestStar = null;
    let bestDistPx = Infinity;

    this.scene.traverse(obj => {
      if (!obj.isSprite || !obj.userData.star) return;

      const projected = obj.position.clone().project(this.camera);
      if (
        projected.z < -1 || projected.z > 1 ||
        Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1
      ) return;

      const sx = (projected.x * 0.5 + 0.5) * rect.width;
      const sy = (-projected.y * 0.5 + 0.5) * rect.height;
      const distPx = Math.hypot(this.pointerPx.x - sx, this.pointerPx.y - sy);
      const pickRadiusPx = this._getStarPickRadiusPx(obj, rect.height);

      if (distPx <= pickRadiusPx && distPx < bestDistPx) {
        bestDistPx = distPx;
        bestStar = obj.userData.star;
      }
    });

    return bestStar;
  }

  _checkStarHover() {
    const star = this._pickStarByScreenSpace();
    if (star !== this.hoveredStar) {
      this.hoveredStar = star;
      if (this.onStarHover) this.onStarHover(star);
    }
  }

  _checkStarClick() {
    const star = this._pickStarByScreenSpace();
    if (star && this.onStarClick) {
      this.onStarClick(star);
    }
  }

  _lookAlong(dir) {
    const viewDir = dir.clone().normalize();
    this.targetYaw = Math.atan2(-viewDir.x, -viewDir.z);
    this.targetPitch = Math.asin(Math.max(-1, Math.min(1, viewDir.y)));
    this.targetRoll = 0;
  }

  flyToEarthLocation(surfaceDir) {
    const dir = surfaceDir.clone().normalize();
    const surfaceR = 2.5; // just above Earth's sphere (radius 2)
    this.targetPosition.copy(dir.clone().multiplyScalar(surfaceR));
    this._lookAlong(dir);
  }

  flyToConstellation(constellation) {
    // Place camera on Earth's surface closest to the constellation,
    // so Earth is always behind the viewer (fixes southern constellations like Carina)
    const dir = constellation.getApparentDirection();
    this.flyToEarthLocation(dir);
  }

  resetToOrigin() {
    this.targetPosition.set(0, 3, 0); // above north pole
    this.targetYaw = 0;
    this.targetPitch = 0.3;
    this.targetRoll = 0;
  }

  update(dt) {
    const speed = this.moveSpeed * dt;
    const fwd = this._forwardVec();
    const right = this._rightVec();
    const up = this._upVec();

    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.targetPosition.addScaledVector(fwd, speed);
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.targetPosition.addScaledVector(fwd, -speed);
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.targetPosition.addScaledVector(right, -speed);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.targetPosition.addScaledVector(right, speed);
    }
    if (this.keys['KeyQ']) {
      this.targetRoll -= dt * 1.5;
    }
    if (this.keys['KeyE']) {
      this.targetRoll += dt * 1.5;
    }
    if (this.keys['Space']) {
      this.targetPosition.addScaledVector(up, speed);
    }

    // Speed boost with Shift
    this.moveSpeed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 20 : 5;

    // Smooth interpolation
    this.position.lerp(this.targetPosition, 0.12);
    this.yaw += (this.targetYaw - this.yaw) * 0.1;
    this.pitch += (this.targetPitch - this.pitch) * 0.1;
    this.roll += (this.targetRoll - this.roll) * 0.1;

    // Compute current speed (ly/sec)
    const posDelta = this.position.clone().sub(this._prevPos);
    this.currentSpeed = dt > 0 ? posDelta.length() / dt : 0;
    this._prevPos = this.position.clone();

    // Camera orientation via Euler
    this.camera.position.copy(this.position);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch, this.yaw, this.roll);

    // Raycasting for hover
    this._checkStarHover();
  }

  // Speed as multiples of c (1 ly/year = 1c; we treat 1 render-second as 1 year)
  getSpeedC() {
    return this.currentSpeed; // ly/sec ≈ c if 1 sec = 1 year
  }

  getDistFromEarth() {
    return this.position.length(); // in light-years
  }
};
