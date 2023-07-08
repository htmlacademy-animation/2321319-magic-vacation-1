import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import { ThemeColor, SvgShape } from "../../../general/consts";
import DefaultScene from "./default-scene";
import { easeOutQuad } from "../../../general/easing";

export default class PyramidScene extends DefaultScene {
  constructor(objectLoader, aspectRatio) {
    super(objectLoader, aspectRatio);
    this.sceneId = ThemeColor.BLUE;
    this.initAnimationsSettings();
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [`${SvgShape.LEAF.id}-1`]: {
        durations: [2500],
        finites: [false],
        delays: [400],
        animationFunctions: [
          (el, progress) => this.firstLeafMoveAnimationFunc(el, progress),
        ],
      },
      [`${SvgShape.LEAF.id}-2`]: {
        durations: [2500],
        finites: [false],
        delays: [400],
        animationFunctions: [
          (el, progress) => this.secondLeafMoveAnimationFunc(el, progress),
        ],
      },
    };
  }

  firstLeafMoveAnimationFunc(el, progress) {
    if (progress < 0.05) return;
    const progressWithEasing = easeOutQuad(progress - 0.05);
    const rotation =
      (5 * Math.sin(Math.PI * 5 * progressWithEasing + 12.5)) /
      ((progressWithEasing + 1) * (progressWithEasing + 1));
      el.element.children[0].rotation.set(
        0,
        0,
        THREE.Math.degToRad(rotation)
      );
  }

  secondLeafMoveAnimationFunc(el, progress) {
    const progressWithEasing = easeOutQuad(progress);
    const rotation =
      (5 * Math.sin(Math.PI * 5 * progressWithEasing + 12.5)) /
      ((progressWithEasing + 1) * (progressWithEasing + 1));
    el.element.children[0].rotation.set(
      0,
      0,
      THREE.Math.degToRad(rotation)
    );
  }
}
