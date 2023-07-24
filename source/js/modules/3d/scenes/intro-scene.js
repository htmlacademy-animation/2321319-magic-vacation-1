import * as THREE from "three";
import {SceneObjects} from "../objects/scene-objects-config";
import SuitcaseRig from "../objects/suitcase-rig";
import AirplaneRig from "../objects/airplane-rig";
import {Screen, AnimatedPrimitives, SvgShape, Objects} from "../../../general/consts";
import {easeOutQuad, easeInOutQuad, easeInQuad} from "../../../general/easing";
import DefaultScene from "./default-scene";

const DELAY_FOR_STEAMING_ANIMATION = 2000;

export default class IntroScene extends DefaultScene {
  constructor(objectLoader, aspectRatio) {
    super(objectLoader, aspectRatio);
    this.sceneId = Screen.TOP;
    this.initAnimationsSettings();
  }

  initObjects() {
    super.initObjects();
    this.initSuitcaseObject();
    this.initAirplaneObject();
  }

  initSuitcaseObject() {
    const suitcaseSettings = SceneObjects[this.sceneId].objects.find((element) => element.id === Objects.SUITCASE.id);
    if (!suitcaseSettings) {
      return;
    }
    const object = this.objectLoader
      .getPreparedObjectWithMateral(suitcaseSettings.id, suitcaseSettings.materialType, suitcaseSettings.materialProps)
      .clone();
    object.name = suitcaseSettings.name || suitcaseSettings.id + `_OBJ`;
    this.suitcaseRig = new SuitcaseRig(object);
    this.setPosition(this.suitcaseRig, suitcaseSettings.position, suitcaseSettings.scale, suitcaseSettings.rotation);
    this.sceneGroup.add(this.suitcaseRig);
  }

  initAirplaneObject() {
    const airplaneSettings = SceneObjects[this.sceneId].objects.find((element) => element.id === Objects.AIRPLANE.id);
    if (!airplaneSettings) {
      return;
    }
    const object = this.objectLoader
      .getPreparedObjectWithMateral(airplaneSettings.id, airplaneSettings.materialType, airplaneSettings.materialProps)
      .clone();
    object.name = airplaneSettings.name || airplaneSettings.id + `_OBJ`;
    this.airplaneRig = new AirplaneRig(object);
    this.setPosition(this.airplaneRig, airplaneSettings.position, airplaneSettings.scale, airplaneSettings.rotation);
    this.sceneGroup.add(this.airplaneRig);
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [AnimatedPrimitives.CHANDELIER]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 380],
        animationFunctions: [
          (element, progress) => this.chandelierAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1.35),
        ],
      },
      [SvgShape.FLAMINGO.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 250],
        animationFunctions: [
          (element, progress) => this.flamingoAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1.2),
        ],
      },
      [SvgShape.SNOWFLAKE.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 100],
        animationFunctions: [
          (element, progress) => this.snowflakeAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1.1),
        ],
      },
      [SvgShape.QUESTION.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 400],
        animationFunctions: [
          (element, progress) => this.questionAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1),
        ],
      },
      [SvgShape.LEAF.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 500],
        animationFunctions: [
          (element, progress) => this.leafAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1.25),
        ],
      },
      [Objects.WATERMELON.id]: {
        durations: [800, 2500],
        finites: [true, false],
        delays: [1200, DELAY_FOR_STEAMING_ANIMATION + 650],
        animationFunctions: [
          (element, progress) => this.watermelonAnimationFunc(element, progress),
          (element, progress) => this.elementMoveAnimationFunc(element, progress, 1.3),
        ],
      },
      [Objects.SUITCASE.id]: {
        durations: [900, 2500],
        finites: [true, false],
        delays: [1300, DELAY_FOR_STEAMING_ANIMATION + 550],
        animationFunctions: [
          (element, progress) => this.suitcaseAnimationFunc(element, progress),
          (element, progress) => this.suitcaseMoveAnimationFunc(element, progress, 0.8),
        ],
      },
      [Objects.AIRPLANE.id]: {
        durations: [1000],
        finites: [true],
        delays: [2000],
        animationFunctions: [
          (element, progress) => this.airplaneAnimationFunc(element, progress),
        ],
      }
    };
  }

  getAspectRelatedCoefficent() {
    return Math.min(this.aspectRatio * 0.7, 1);
  }

  planeOpacityAnimationFunc(element, progress, isRevert = true) {
    element.material.opacity = isRevert ? 1 - progress : progress;
  }

  suitcaseAnimationFunc(_element, progress) {
    const scale = 0.55 * easeOutQuad(progress);
    this.suitcaseRig.scaleDiff = scale;
    const x = -75 * easeOutQuad(progress);
    const y = (progress <= 0.66 ? 195 : 350) * Math.sin(1.5 * Math.PI * progress);
    const z = 125 * easeOutQuad(progress);
    const yRotate = 270 - 55 * easeInOutQuad(progress);
    const zRotate = 120 - 105 * easeInOutQuad(progress);
    this.suitcaseRig.xShift = x;
    this.suitcaseRig.yShift = y;
    this.suitcaseRig.zShift = z;
    this.suitcaseRig.angleY = THREE.Math.degToRad(yRotate);
    this.suitcaseRig.angleZ = THREE.Math.degToRad(zRotate);
    this.suitcaseRig.invalidate();
  }

  suitcaseMoveAnimationFunc(_element, progress, amplitude) {
    this.elementMoveAnimationFunc({element: this.suitcaseRig}, progress, amplitude);
  }

  airplaneAnimationFunc(_element, progress) {
    this.airplaneRig.angleXZMoving = this.airplaneRig.startAngleXZ - Math.PI * progress;
    this.airplaneRig.radius = 100 + 50 * progress;
    this.airplaneRig.yShift = this.airplaneRig.initialY + 50 * progress;
    this.airplaneRig.angleZ = 15 * easeInOutQuad(progress);
    this.airplaneRig.angleX = -90 * Math.sin(3.85 * progress);
    this.airplaneRig.scaleDiff = 1.45 * easeInQuad(progress);
    this.airplaneRig.invalidate();
  }

  chandelierAnimationFunc(element, progress) {
    const x = 5 + 480 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = -20 - 120 * easeOutQuad(progress);
    const z = 25 + 80 * easeOutQuad(progress);
    const scale = 0.7 * easeOutQuad(progress);
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
    const x = -50 - 460 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = 30 + 354 * easeOutQuad(progress);
    const z = 20 + 60 * easeOutQuad(progress);
    const scale = 0.8 * easeOutQuad(progress);
    const yRotate = 60 - 30 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-10, yRotate, 205]);
  }

  snowflakeAnimationFunc(element, progress) {
    const x = -40 - 355 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = -20 + 120 * easeOutQuad(progress);
    const z = 20 + 50 * easeOutQuad(progress);
    const scale = 1.4 * easeOutQuad(progress);
    const yRotate = 70 - 30 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-20, yRotate, 200]);
  }

  questionAnimationFunc(element, progress) {
    const x = 20 - 135 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = -60 - 285 * easeOutQuad(progress);
    const z = 20 + 45 * easeOutQuad(progress);
    const scale = 1.2 * easeOutQuad(progress);
    const zRotate = 210 - 50 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [-45, 180, zRotate]);
  }

  leafAnimationFunc(element, progress) {
    const x = 7 + 593 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = 40 + 320 * easeOutQuad(progress);
    const z = 20 + 125 * easeOutQuad(progress);
    const scale = 1.8 * easeOutQuad(progress);
    const yRotate = 90 + 45 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [5, yRotate, 245]);
  }

  watermelonAnimationFunc(element, progress) {
    const x = -60 - 540 * easeOutQuad(progress) * this.getAspectRelatedCoefficent();
    const y = -70 - 195 * easeOutQuad(progress);
    const z = 20 + 100 * easeOutQuad(progress);
    const scale = 2.5 * easeOutQuad(progress);
    const zRotate = 210 - 70 * easeOutQuad(progress);
    this.setPosition(element.element, [x, y, z], [scale, scale, scale], [15, -10, zRotate]);
  }
}
