import * as THREE from "three";
import { Screen, AnimatedPrimitives, SvgShape, Objects } from "../../../general/consts";
import { easeOutExpo, easeInOutQuad } from "../../../general/easing";
import DefaultScene from "./default-scene";

export default class IntroScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = Screen.TOP;
    this.initAnimationsSettings();
  }

  initAnimationsSettings() {
    const delayForAnimation = 900;
    this.animationObjects = {
      [AnimatedPrimitives.CHANDELIER]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 1300],
        animationFunctions: [
          (el, progress) => this.chandelierAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 15),
        ],
      },
      [SvgShape.FLAMINGO.id]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 1100],
        animationFunctions: [
          (el, progress) => this.flamingoAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 9),
        ],
      },
      [SvgShape.SNOWFLAKE.id]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 900],
        animationFunctions: [
          (el, progress) => this.snowflakeAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 11),
        ],
      },
      [SvgShape.QUESTION.id]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 1500],
        animationFunctions: [
          (el, progress) => this.questionAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 5),
        ],
      },
      [SvgShape.LEAF.id]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 1600],
        animationFunctions: [
          (el, progress) => this.leafAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 10),
        ],
      },
      [Objects.WATERMELON.id]: {
        durations: [800, 4000],
        finites: [true, false],
        delays: [1200, delayForAnimation + 1700],
        animationFunctions: [
          (el, progress) => this.watermelonAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 13),
        ],
      }
    };
  }

  chandelierAnimationFunc(element, progress) {
    // from 5, -20, 25 to 485 -140 105
    const x = 5 + 480 * easeOutExpo(progress);
    const y = -20 - 120 * easeOutExpo(progress);
    const z = 25 + 80 * easeOutExpo(progress);
    // from 0 0 0 to 0.7, 0.7, 0.7
    const scale = 0.7 * easeOutExpo(progress);
    // from 10 0 -60 to 10, 0, 15
    const zRotate = -60 + 75 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [10, 0, zRotate]);
  }

  elementMoveAnimationFunc(element, progress, amplitude) {
    const y = amplitude * Math.sin(easeInOutQuad(progress) * 2 * Math.PI) + element.element.position.y;
    const currentScale = [element.element.scale.x, element.element.scale.y, element.element.scale.z];
    const currentRotate = [element.element.rotation.x, element.element.rotation.y, element.element.rotation.z];
    this.setPosition(element.element, [element.element.position.x, y, element.element.position.z], [...currentScale], [...currentRotate], true);
  }

  flamingoAnimationFunc(element, progress) {
    // from -50, 30, 20 to -510, 384, 80
    const x = -50 - 460 * easeOutExpo(progress);
    const y = 30 + 354 * easeOutExpo(progress);
    const z = 20 + 60 * easeOutExpo(progress);
    // from 0 0 0 to 0.8, 0.8, 0.8
    const scale = 0.8 * easeOutExpo(progress);
    // from -10 60 205 to -10, 30, 205
    const yRotate = 60 - 30 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-10, yRotate, 205]);
  }

  snowflakeAnimationFunc(element, progress) {
    // from -40, -20, 20 to -395, 100, 70
    const x = -40 - 355 * easeOutExpo(progress);
    const y = -20 + 120 * easeOutExpo(progress);
    const z = 20 + 50 * easeOutExpo(progress);
    // from 0 0 0 to 1.4, 1.4, 1.4
    const scale = 1.4 * easeOutExpo(progress);
    // from -20 70 200 to -20, 40, 200
    const yRotate = 70 - 30 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-20, yRotate, 200]);
  }

  questionAnimationFunc(element, progress) {
    // from 10, -60, 20 to -115, -345, 65
    const x = 20 - 135 * easeOutExpo(progress);
    const y = -60 - 285 * easeOutExpo(progress);
    const z = 20 + 45 * easeOutExpo(progress);
    // from 0 0 0 to 1.2, 1.2, 1.2
    const scale = 1.2 * easeOutExpo(progress);
    // from -45, 180, 210 to -45, 180, 160
    const zRotate = 210 - 50 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-45, 180, zRotate]);
  }

  leafAnimationFunc(element, progress) {
    // from 7, 40, 20 to 690, 360, 145
    const x = 7 + 683 * easeOutExpo(progress);
    const y = 40 + 320 * easeOutExpo(progress);
    const z = 20 + 125 * easeOutExpo(progress);
    // from 0 0 0 to 1.8, 1.8, 1.8
    const scale = 1.8 * easeOutExpo(progress);
    // from 5, 90, 245 to 5, 135, 245
    const yRotate = 90 + 45 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [5, yRotate, 245]);
  }

  watermelonAnimationFunc(element, progress) {
    // from -60, -70, 20 to -750, -265, 120
    const x = -60 - 690 * easeOutExpo(progress);
    const y = -70 - 195 * easeOutExpo(progress);
    const z = 20 + 100 * easeOutExpo(progress);
    // from 0 0 0 to 2.5, 2.5, 2.5
    const scale = 2.5 * easeOutExpo(progress);
    // from 15, -10, 210 to 15, -10, 140
    const zRotate = 210 - 70 * easeOutExpo(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [15, -10, zRotate]);
  }
}
