import * as THREE from "three";

export default class SuitcaseRig extends THREE.Group {
  constructor(object) {
    super();
    this.constructChildren(object);

    this._angleY = 270;
    this._angleYChanged = true;
    this._angleZ = 120;
    this._angleZChanged = true;
    this._yShift = 0;
    this._yShiftChanged = true;
    this._xShift = 0;
    this._xShiftChanged = true;
    this._zShift = 0;
    this._zShiftChanged = true;
    this._scaleDiff = 0;
    this._scaleDiffChanged = true;

    this.invalidate();
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

  set angleY(value) {
    if (this._angleY === value) {
      return;
    }

    this._angleY = value;
    this._angleYChanged = true;
  }

  get angleY() {
    return this._angleY;
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

  set xShift(value) {
    if (this._xShift === value) {
      return;
    }

    this._xShift = value;
    this._xShiftChanged = true;
  }

  get xShift() {
    return this._xShift;
  }

  set zShift(value) {
    if (this._zShift === value) {
      return;
    }

    this._zShift = value;
    this._zShiftChanged = true;
  }

  get zShift() {
    return this._zShift;
  }

  constructChildren(object) {
    this._suitcaseObject = object;
    this._groupRotation = new THREE.Group(); // group for rotation by z
    this._groupRotation.name = object.name;
    this._groupRotation.add(object);
    this._groupMoving = new THREE.Group(); // group for vertical movement and rotation by y
    this._groupMoving.add(this._groupRotation);
    this.add(this._groupMoving); // main group for horisontal movement and scaling
  }

  invalidate() {
    if (this._scaleDiffChanged) {
      this.scale.set(
          this._scaleDiff,
          this._scaleDiff,
          this._scaleDiff
      );
      this._scaleDiffChanged = false;
    }
    if (this._xShiftChanged) {
      this.position.x = this._xShift;
      this._xShiftChanged = false;
    }
    if (this._zShiftChanged) {
      this.position.z = this._zShift;
      this._zShiftChanged = false;
    }
    if (this._yShiftChanged) {
      this._groupMoving.position.y = this._yShift;
      this._yShiftChanged = false;
    }
    if (this._angleZChanged) {
      this._groupRotation.rotation.z = this._angleZ;
      this._angleZChanged = false;
    }
    if (this._angleYChanged) {
      this._groupMoving.rotation.y = this._angleY;
      this._angleYChanged = false;
    }
  }
}
