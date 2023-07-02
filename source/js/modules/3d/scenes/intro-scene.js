import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import SuitcaseRig from "../objects/suitcase-rig";
import AirplaneRig from "../objects/airplane-rig";
import { Screen, AnimatedPrimitives, SvgShape, Objects } from "../../../general/consts";
import { easeOutQuad, easeInOutQuad, easeInQuad } from "../../../general/easing";
import DefaultScene from "./default-scene";

export default class IntroScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = Screen.TOP;
    this.initAnimationsSettings();
  }

  initObjects() {
    super.initObjects();
    this.initSuitcaseObject();
    this.initAirplaneObject();
  }

  initSuitcaseObject() {
    const suitcaseSettings = SceneObjects[this.sceneId].objects.find((el) => el.id === Objects.SUITCASE.id);
    if (!suitcaseSettings) return;
    const object = this.objectLoader
      .getPreparedObjectWithMateral(suitcaseSettings.id, suitcaseSettings.materialType, suitcaseSettings.materialProps)
      .clone();
    object.name = suitcaseSettings.name || suitcaseSettings.id + `_OBJ`;
    this.suitcaseRig = new SuitcaseRig(object);
    this.setPosition(this.suitcaseRig, suitcaseSettings.position, suitcaseSettings.scale, suitcaseSettings.rotation);
    this.sceneGroup.add(this.suitcaseRig);
  }

  initAirplaneObject() {
    const airplaneSettings = SceneObjects[this.sceneId].objects.find((el) => el.id === Objects.AIRPLANE.id);
    if (!airplaneSettings) return;
    const object = this.objectLoader
      .getPreparedObjectWithMateral(airplaneSettings.id, airplaneSettings.materialType, airplaneSettings.materialProps)
      .clone();
    object.name = airplaneSettings.name || airplaneSettings.id + `_OBJ`;
    this.airplaneRig = new AirplaneRig(object);
    this.setPosition(this.airplaneRig, airplaneSettings.position, airplaneSettings.scale, airplaneSettings.rotation);
    this.sceneGroup.add(this.airplaneRig);
  }

  initAnimationsSettings() {
    const delayForAnimation = 2000;
    this.animationObjects = {
      [AnimatedPrimitives.CHANDELIER]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 380],
        animationFunctions: [
          (el, progress) => this.chandelierAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1.35),
        ],
      },
      [SvgShape.FLAMINGO.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 250],
        animationFunctions: [
          (el, progress) => this.flamingoAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1.2),
        ],
      },
      [SvgShape.SNOWFLAKE.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 100],
        animationFunctions: [
          (el, progress) => this.snowflakeAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1.1),
        ],
      },
      [SvgShape.QUESTION.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 400],
        animationFunctions: [
          (el, progress) => this.questionAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1),
        ],
      },
      [SvgShape.LEAF.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 500],
        animationFunctions: [
          (el, progress) => this.leafAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1.25),
        ],
      },
      [Objects.WATERMELON.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, delayForAnimation + 650],
        animationFunctions: [
          (el, progress) => this.watermelonAnimationFunc(el, progress),
          (el, progress) => this.elementMoveAnimationFunc(el, progress, 1.3),
        ],
      },
      [Objects.SUITCASE.id]: {
        durations: [900, 2500],
        finites: [true, false],
        delays: [1300, delayForAnimation + 550],
        animationFunctions: [
          (el, progress) => this.suitcaseAnimationFunc(el, progress),
          (el, progress) => this.suitcaseMoveAnimationFunc(el, progress, 0.8),
        ],
      },
      [Objects.AIRPLANE.id]: {
        durations: [1000],
        finites: [true],
        delays: [2000],
        animationFunctions: [
          (el, progress) => this.airplaneAnimationFunc(el, progress),
        ],
      }
    };
  }

  planeOpacityAnimationFunc(element, progress) {
    element.material.opacity = 1 - progress;
  }

  suitcaseAnimationFunc(element, progress) {
    // from 0 0 0 to [0.55, 0.55, 0.55]
    const scale = 0.55 * easeOutQuad(progress);
    this.suitcaseRig.scaleDiff = scale;
    // from 0 0 0 position: [-75, -350, 125],
    const x = -75 * easeOutQuad(progress);
    const y = (progress <= 0.66 ? 195 : 350) * Math.sin(1.5 * Math.PI * progress);
    const z = 125 * easeOutQuad(progress);
    // from 30 270 120 to [30, 215, 15]
    const yRotate = 270 - 55 * easeInOutQuad(progress);
    const zRotate = 120 - 105 * easeInOutQuad(progress);
    this.suitcaseRig.xShift = x;
    this.suitcaseRig.yShift = y;
    this.suitcaseRig.zShift = z;
    this.suitcaseRig.angleY = THREE.Math.degToRad(yRotate);
    this.suitcaseRig.angleZ = THREE.Math.degToRad(zRotate);
    this.suitcaseRig.invalidate();
  }

  suitcaseMoveAnimationFunc(element, progress, amplitude) {
    this.elementMoveAnimationFunc({element: this.suitcaseRig}, progress, amplitude);
  }

  airplaneAnimationFunc(element, progress) {
    this.airplaneRig.angleXZMoving = this.airplaneRig.startAngleXZ - Math.PI * progress;
    this.airplaneRig.radius = 100 + 50 * progress;
    this.airplaneRig.yShift = this.airplaneRig.initialY + 50 * progress;
    this.airplaneRig.angleZ = 15 * easeInOutQuad(progress);
    this.airplaneRig.angleX = -90 * Math.sin(3.85 * progress);
    this.airplaneRig.scaleDiff = 1.45 * easeInQuad(progress);
    this.airplaneRig.invalidate();
  }

  chandelierAnimationFunc(element, progress) {
    // from 5, -20, 25 to 485 -140 105
    const x = 5 + 480 * easeOutQuad(progress);
    const y = -20 - 120 * easeOutQuad(progress);
    const z = 25 + 80 * easeOutQuad(progress);
    // from 0 0 0 to 0.7, 0.7, 0.7
    const scale = 0.7 * easeOutQuad(progress);
    // from 10 0 -60 to 10, 0, 15
    const zRotate = -60 + 75 * easeOutQuad(progress);
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
    const x = -50 - 460 * easeOutQuad(progress);
    const y = 30 + 354 * easeOutQuad(progress);
    const z = 20 + 60 * easeOutQuad(progress);
    // from 0 0 0 to 0.8, 0.8, 0.8
    const scale = 0.8 * easeOutQuad(progress);
    // from -10 60 205 to -10, 30, 205
    const yRotate = 60 - 30 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-10, yRotate, 205]);
  }

  snowflakeAnimationFunc(element, progress) {
    // from -40, -20, 20 to -395, 100, 70
    const x = -40 - 355 * easeOutQuad(progress);
    const y = -20 + 120 * easeOutQuad(progress);
    const z = 20 + 50 * easeOutQuad(progress);
    // from 0 0 0 to 1.4, 1.4, 1.4
    const scale = 1.4 * easeOutQuad(progress);
    // from -20 70 200 to -20, 40, 200
    const yRotate = 70 - 30 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-20, yRotate, 200]);
  }

  questionAnimationFunc(element, progress) {
    // from 10, -60, 20 to -115, -345, 65
    const x = 20 - 135 * easeOutQuad(progress);
    const y = -60 - 285 * easeOutQuad(progress);
    const z = 20 + 45 * easeOutQuad(progress);
    // from 0 0 0 to 1.2, 1.2, 1.2
    const scale = 1.2 * easeOutQuad(progress);
    // from -45, 180, 210 to -45, 180, 160
    const zRotate = 210 - 50 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-45, 180, zRotate]);
  }

  leafAnimationFunc(element, progress) {
    // from 7, 40, 20 to 690, 360, 145
    const x = 7 + 683 * easeOutQuad(progress);
    const y = 40 + 320 * easeOutQuad(progress);
    const z = 20 + 125 * easeOutQuad(progress);
    // from 0 0 0 to 1.8, 1.8, 1.8
    const scale = 1.8 * easeOutQuad(progress);
    // from 5, 90, 245 to 5, 135, 245
    const yRotate = 90 + 45 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [5, yRotate, 245]);
  }

  watermelonAnimationFunc(element, progress) {
    // from -60, -70, 20 to -750, -265, 120
    const x = -60 - 690 * easeOutQuad(progress);
    const y = -70 - 195 * easeOutQuad(progress);
    const z = 20 + 100 * easeOutQuad(progress);
    // from 0 0 0 to 2.5, 2.5, 2.5
    const scale = 2.5 * easeOutQuad(progress);
    // from 15, -10, 210 to 15, -10, 140
    const zRotate = 210 - 70 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [15, -10, zRotate]);
  }
}
