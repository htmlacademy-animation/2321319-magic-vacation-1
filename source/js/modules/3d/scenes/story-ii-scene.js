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
          (el, progress) => this.aiAnimationFunc(el, progress),
        ],
      }
    };
  }

  aiAnimationFunc(el, progress) {
    const y = 10 * Math.sin(2 * Math.PI * progress);
    const sonyaObj = el.element.children[0].children[0].children[0];
    sonyaObj.position.set(0, y, 0);
    const rotateY = 2 * Math.sin(6 * progress - 0.5) - 50;
    const currentRotateLeft = sonyaObj.children[1].rotation;
    const currentRotateRight = sonyaObj.children[2].rotation;
    sonyaObj.children[1].rotation.set(
        currentRotateLeft.x,
        THREE.Math.degToRad(rotateY),
        currentRotateLeft.z
    );
    sonyaObj.children[2].rotation.set(
        currentRotateRight.x,
        THREE.Math.degToRad(-rotateY),
        currentRotateRight.z
    );
  }
}
