import * as THREE from "three";
import { rotateAboutPoint } from "./helpers";

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

    this.minAdditionalAngleY = -25;
    this.maxAdditionalAngleY = 25;
    this._additionalAngleY = 0;
    this._additionalAngleYChanged = true;

    this._targetForLookY = 0;
    this._targetForLookYChanged = true;
    this._targetForLookZ = 0;
    this._targetForLookZChanged = true;
    this._cameraRotationX = 0;
    this._cameraRotationXChanged = true;

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

  set additionalAngleY(value) {
    if (
      this._additionalAngleY === value ||
      value < this.minAdditionalAngleY ||
      value > this.maxAdditionalAngleY
    )
      return;

    this._additionalAngleY = value;
    this._additionalAngleYChanged = true;
  }

  get additionalAngleY() {
    return this._additionalAngleY;
  }

  set targetForLookY(value) {
    if (this._targetForLookY === value) return;

    this._targetForLookY = value;
    this._targetForLookYChanged = true;
  }

  get targetForLookY() {
    return this._targetForLookY;
  }

  set targetForLookZ(value) {
    if (this._targetForLookZ === value) return;

    this._targetForLookZ = value;
    this._targetForLookZChanged = true;
  }

  get targetForLookZ() {
    return this._targetForLookZ;
  }

  set cameraRotationX(value) {
    if (this._cameraRotationX === value) return;

    this._cameraRotationX = value;
    this._cameraRotationXChanged = true;
  }

  get cameraRotationX() {
    return this._cameraRotationX;
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

  addObjectToGroupRotation(object) {
    this._groupRotationX.add(object);
  }

  setCameraLookAt(
    coordinates = new THREE.Vector3(
      0,
      this._targetForLookY,
      this._targetForLookZ
    )
  ) {
    this._camera.lookAt(coordinates);
    this._camera.rotation.y = this._cameraRotationX;
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
      this._camera.rotation.x = this._angleY;
      this._angleYChanged = false;
    }
    if (this._additionalAngleYChanged) {
      this._cameraNull.position.y = this._additionalAngleY;
      this._additionalAngleYChanged = false;
    }

    this.setCameraLookAt();
  }
}
