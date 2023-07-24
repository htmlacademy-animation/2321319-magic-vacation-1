import * as THREE from "three";
import {ThemeColor, Objects} from "../../../general/consts";
import DefaultScene from "./default-scene";
import {easeInOutQuad} from "../../../general/easing";

export default class SnowmanScene extends DefaultScene {
  constructor(objectLoader, aspectRatio) {
    super(objectLoader, aspectRatio);
    this.sceneId = ThemeColor.LIGHT_BLUE;
    this.initAnimationsSettings();
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [Objects.COMPASS.id]: {
        durations: [2000],
        finites: [false],
        delays: [400],
        animationFunctions: [
          (element, progress) => this.compassAnimationFunc(element, progress),
        ],
      }
    };
  }

  compassAnimationFunc(element, progress) {
    const rotation = 5 * Math.sin(Math.PI * easeInOutQuad(progress));
    element.element.getObjectByName(`ArrowCenter`).rotation.set(
        0,
        0,
        THREE.Math.degToRad(rotation)
    );
  }
}
