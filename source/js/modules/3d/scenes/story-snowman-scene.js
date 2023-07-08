import * as THREE from "three";
import { ThemeColor, Objects } from "../../../general/consts";
import { SceneObjects } from "../objects/scene-objects-config";
import DefaultScene from "./default-scene";
import { easeInOutQuad } from "../../../general/easing";

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
          (el, progress) => this.compassAnimationFunc(el, progress),
        ],
      }
    };
  }

  compassAnimationFunc(el, progress) {
    const rotation = 5 * Math.sin(Math.PI * easeInOutQuad(progress));
    el.element.children[0].children[0].children[0].rotation.set(
      0,
      0,
      THREE.Math.degToRad(rotation)
    );
  }
}
