import * as THREE from "three";

export default class AirplaneRig extends THREE.Group {
  constructor(object) {
    super();
    this.constructChildren(object);

    this._initialX = 0;
    this._initialZ = 0;
    this._initialY = 0;
    this._startAngleXZ = (5 * Math.PI) / 4;

    this._angleXZMoving = this._startAngleXZ;
    this._angleXZMovingChanged = true;
    this._radius = 100;
    this._radiusChanged = true;
    this._yShift = 0;
    this._yShiftChanged = true;

    this._angleX = 0;
    this._angleXChanged = true;
    this._angleZ = 0;
    this._angleZChanged = true;
    this._scaleDiff = 0;
    this._scaleDiffChanged = true;

    this.invalidate();
  }

  get initialX() {
    return this._initialX;
  }

  get initialY() {
    return this._initialY;
  }

  get initialZ() {
    return this._initialZ;
  }

  get startAngleXZ() {
    return this._startAngleXZ;
  }

  set angleXZMoving(value) {
    if (this._angleXZMoving === value) {
      return;
    }

    this._angleXZMoving = value;
    this._angleXZMovingChanged = true;
  }

  get angleXZMoving() {
    return this._angleXZMoving;
  }

  set radius(value) {
    if (this._radius === value || value < 0) {
      return;
    }

    this._radius = value;
    this._radiusChanged = true;
  }

  get radius() {
    return this._radius;
  }

  set yShift(value) {
    if (this._yShift === value) {
      return;
    }

    this._yShift = value;
    this._yShiftChanged = true;
  }

  get yShift() {
    return this._yShift;
  }

  set angleZ(value) {
    if (this._angleZ === value) {
      return;
    }

    this._angleZ = value;
    this._angleZChanged = true;
  }

  get angleZ() {
    return this._angleZ;
  }

  set angleX(value) {
    if (this._angleX === value) {
      return;
    }

    this._angleX = value;
    this._angleXChanged = true;
  }

  get angleX() {
    return this._angleX;
  }

  set scaleDiff(value) {
    if (this._scaleDiff === value) {
      return;
    }

    this._scaleDiff = value;
    this._scaleDiffChanged = true;
  }

  get scaleDiff() {
    return this._scaleDiff;
  }

  constructChildren(object) {
    this._airplaneObject = object;
    this._groupRotation = new THREE.Group();
    this._groupRotation.name = object.name;
    this._groupRotation.add(object);
    this._groupMoving = new THREE.Group();
    this._groupMoving.add(this._groupRotation);
    this._groupXRotation = new THREE.Group();
    this._groupXRotation.add(this._groupMoving);
    this.add(this._groupXRotation);
  }

  invalidate() {
    if (this._angleXZMovingChanged) {
      this._groupRotation.position.x = this._initialX + Math.cos(this._angleXZMoving) * this.radius;
      this._groupRotation.position.z = this._initialZ + Math.sin(this._angleXZMoving) * this.radius;
      this._groupRotation.rotation.y = Math.PI - this._angleXZMoving;
      this._angleXZMovingChanged = false;
    }

    if (this._yShiftChanged) {
      this._groupMoving.position.y = this._yShift;
      this._yShiftChanged = false;
    }

    if (this._angleZChanged) {
      this._groupMoving.rotation.z = THREE.Math.degToRad(this._angleZ);
      this._angleZChanged = false;
    }

    if (this._angleXChanged) {
      this._airplaneObject.rotation.z = THREE.Math.degToRad(this._angleX);
      this._angleXChanged = false;
    }

    if (this._scaleDiffChanged && this._scaleDiff >= 0) {
      this.scale.set(this._scaleDiff, this._scaleDiff, this._scaleDiff);
      this._scaleDiffChanged = false;
    }
  }
}
