import * as THREE from "three";
import {ThemeColor, Objects} from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class IIScene extends DefaultScene {
  constructor(objectLoader, aspectRatio) {
    super(objectLoader, aspectRatio);
    this.sceneId = ThemeColor.PURPLE;
    this.initAnimationsSettings();
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [Objects.SONYA.id]: {
        durations: [3200],
        finites: [false],
        delays: [400],
        animationFunctions: [
          (element, progress) => this.aiAnimationFunc(element, progress),
        ],
      }
    };
  }

  aiAnimationFunc(element, progress) {
    const y = 10 * Math.sin(2 * Math.PI * progress);
    const sonyaObj = element.element.getObjectByName(`Sonya_2`);
    sonyaObj.position.set(0, y, 0);
    const rotationY = 2 * Math.sin(6 * progress - 0.5) - 50;
    const currentRotationLeft = sonyaObj.getObjectByName(`RightHand`).rotation;
    const currentRotationRight = sonyaObj.getObjectByName(`LeftHand`).rotation;
    sonyaObj.getObjectByName(`RightHand`).rotation.set(
        currentRotationLeft.x,
        THREE.Math.degToRad(rotationY),
        currentRotationLeft.z
    );
    sonyaObj.getObjectByName(`LeftHand`).rotation.set(
        currentRotationRight.x,
        THREE.Math.degToRad(-rotationY),
        currentRotationRight.z
    );
  }
}
