import * as THREE from "three";

export default class CameraRig extends THREE.Group {
  constructor(object) {
    super();
    this.constructChildren(object);

    this._angleX = 0;
    this._angleXChanged = true;

    this._angleY = 0;
    this._angleYChanged = true;

    this._zShift = 0;
    this._zShiftChanged = true;

    this._targetForLookY = 0;
    this._targetForLookYChanged = true;

    this.invalidate();
  }

  set angleX(value) {
    if (this._angleX === value) return;

    this._angleX = value;
    this._angleXChanged = true;
  }

  get angleX() {
    return this._angleX;
  }

  set angleY(value) {
    if (this._angleY === value) return;

    this._angleY = value;
    this._angleYChanged = true;
  }

  get angleY() {
    return this._angleY;
  }

  set zShift(value) {
    if (this._zShift === value) return;

    this._zShift = value;
    this._zShiftChanged = true;
  }

  get zShift() {
    return this._zShift;
  }

  set targetForLookY(value) {
    if (this._targetForLookY === value) return;

    this._targetForLookY = value;
    this._targetForLookYChanged = true;
  }

  get targetForLookY() {
    return this._targetForLookY;
  }

  constructChildren(object) {
    this._groupRotationX = new THREE.Group();
    this._groupMoveZ = new THREE.Group();
    this._cameraNull = new THREE.Group();
    this._camera = object;
    this.addObjectToCameraNull(object);
    this._groupMoveZ.add(this._cameraNull);
    this._groupRotationX.add(this._groupMoveZ);
    this.add(this._groupRotationX);
  }

  addObjectToCameraNull(object) {
    this._cameraNull.add(object);
  }

  invalidate() {
    if (this._zShiftChanged) {
      this._groupMoveZ.position.z = this._zShift;
      this._zShiftChanged = false;
    }
    if (this._angleXChanged) {
      this._groupRotationX.rotation.y = this._angleX;
      this._angleXChanged = false;
    }
    if (this._angleYChanged) {
      this._cameraNull.rotation.x = this._angleY;
      this._angleYChanged = false;
    }
    if (this._targetForLookYChanged) {
      this._camera.lookAt(0, this._targetForLookY, 0);
      console.log('look at',  this._targetForLookY)
      this._targetForLookYChanged = false;
    }
  }
}
