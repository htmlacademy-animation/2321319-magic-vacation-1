import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import { ThemeColor, SvgShape } from "../../../general/consts";
import DefaultScene from "./default-scene";
import { easeOutQuad } from "../../../general/easing";

export default class PyramidScene extends DefaultScene {
  constructor(objectLoader, aspectRatio, customMaterial) {
    super(objectLoader, aspectRatio);
    this.sceneId = ThemeColor.BLUE;
    this.customMaterial = customMaterial;
    this.initAnimationsSettings();
  }

  updateUniforms() {
    const bubblesSetting = this.getInitialBubblesPosition();
    this.customMaterial.uniforms.hasBubbles.value = bubblesSetting.length;
    bubblesSetting.forEach((el, index) => {
      this.customMaterial.uniforms.bubbles.value[index] = {
        center: new THREE.Vector2(el.center.x, el.center.y),
        radius: el.radius,
      };
    });
    this.customMaterial.hue = 0.0;
    this.customMaterial.needsUpdate = true;
  }

  getInitialBubblesPosition() {
    return [
      {
        center: { x: 0.45, y: -0.16 },
        radius: 0.08,
      },
      {
        center: { x: 0.3, y: -0.12 },
        radius: 0.06,
      },
      {
        center: { x: 0.49, y: -0.06 },
        radius: 0.03,
      },
    ];
  }

  getCustomMaterialSceneSettings() {
    return {
      durations: [2000, 2500, 2700, 2800],
      finites: [false, true, true, true],
      delays: [0, 1200, 1700, 1900],
      animationFunctions: [
        (_el, progress) => this.hueBlinkAnimationFunc(progress),
        (_el, progress) => this.bubbleMoveAnimation(0, progress),
        (_el, progress) => this.bubbleMoveAnimation(1, progress),
        (_el, progress) => this.bubbleMoveAnimation(2, progress),
      ],
    };
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
    el.element.children[0].rotation.set(0, 0, THREE.Math.degToRad(rotation));
  }

  secondLeafMoveAnimationFunc(el, progress) {
    const progressWithEasing = easeOutQuad(progress);
    const rotation =
      (5 * Math.sin(Math.PI * 5 * progressWithEasing + 12.5)) /
      ((progressWithEasing + 1) * (progressWithEasing + 1));
    el.element.children[0].rotation.set(0, 0, THREE.Math.degToRad(rotation));
  }

  hueBlinkAnimationFunc(progress) {
    const hueForProgress =
      6 * Math.sin(6.3 * progress + 1.6) - 6 + Math.random();
    const hueRad = THREE.Math.degToRad(hueForProgress);
    this.customMaterial.uniforms.hue.value = hueRad;
    this.customMaterial.needsUpdate = true;
  }

  bubbleMoveAnimation(index, progress) {
    let [x, y] = [0, 0];
    switch (index) {
      case 0:
        [x, y] = this.firstBubbleMoveAnimationFunc(progress);
        break;
      case 1:
        [x, y] = this.secondBubbleMoveAnimationFunc(progress);
        break;
      case 2:
        [x, y] = this.thirdBubbleMoveAnimationFunc(progress);
        break;
    }
    this.customMaterial.uniforms.bubbles.value[index].center =
      new THREE.Vector2(x, y);
    this.customMaterial.needsUpdate = true;
  }

  firstBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.getInitialBubblesPosition()[0].radius
    );
    const newX =
      0.035 * Math.sin(15 * progress + 1.5) * Math.exp(-0.8 * progress);
    return this.getBubbleMoveAnimation(0, newX, newY);
  }

  secondBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.getInitialBubblesPosition()[1].radius
    );
    const newX =
      0.025 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    return this.getBubbleMoveAnimation(1, newX, newY);
  }

  thirdBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.getInitialBubblesPosition()[2].radius
    );
    const newX =
      0.02 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    return this.getBubbleMoveAnimation(2, newX, newY);
  }

  getProgressedValue(progress, diameter) {
    return progress + diameter + diameter * progress;
  }

  getBubbleMoveAnimation(index, curX, curY) {
    const bubblePosition = this.getInitialBubblesPosition()[index];
    let [x, y] = [bubblePosition.center.x, bubblePosition.center.y];
    y += curY;
    x += curX;

    return [x, y];
  }
}
