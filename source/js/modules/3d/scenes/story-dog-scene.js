import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import {
  ThemeColor,
  Objects,
  AnimatedPrimitives,
} from "../../../general/consts";
import { easeInOutQuad, easeOutQuad } from "../../../general/easing";
import DefaultScene from "./default-scene";

export default class DogScene extends DefaultScene {
  constructor(objectLoader, aspectRatio) {
    super(objectLoader, aspectRatio);
    this.sceneId = ThemeColor.LIGHT_PURPLE;
    this.suitcaseStartPosition = this.getSuitcaseStartPosition();
    this.chandlierAngle = 2;
    this.isSuitcaseApear = false;
    this.initAnimationsSettings();
  }

  getSuitcaseStartPosition() {
    return [-336, this.isPortrait() ? -674 : -747, 750];
  }

  onResizeUpdate(aspectRatio) {
    super.onResizeUpdate(aspectRatio);
    this.suitcaseStartPosition = this.getSuitcaseStartPosition();
    this.suitcase.position.y = this.suitcaseStartPosition[1];
  }

  initObjects() {
    super.initObjects();
    const chandlier = this.sceneGroup.children.find(
      (el) => el.name === AnimatedPrimitives.CHANDELIER
    );
    if (chandlier) this.setRotateOfChandlier(chandlier, this.chandlierAngle);
    this.addSuitcase();
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [Objects.SUITCASE.id]: {
        durations: [10, 400],
        finites: [true, true],
        delays: [400, 500],
        animationFunctions: [
          (el, progress) => this.suitcaseShowAnimationFunc(el, progress),
          (el, progress) => this.suitcaseAppearenceAnimationFunc(el, progress),
        ],
      },
      [Objects.DOG.id]: {
        durations: [4800],
        finites: [false],
        delays: [500],
        animationFunctions: [
          (el, progress) => this.dogTailMoveAnimationFunc(el, progress),
        ],
      },
      [AnimatedPrimitives.CHANDELIER]: {
        durations: [4500],
        finites: [false],
        delays: [400],
        animationFunctions: [
          (el, progress) => this.chandlierMoveAnimationFunc(el, progress),
        ],
      },
    };
  }

  setRotateOfChandlier(object, rotationAngle) {
    const position = [object.position.x, object.position.y, object.position.z];
    const rotation = [object.rotation.x, object.rotation.y, object.rotation.z];
    const scale = [object.scale.x, object.scale.y, object.scale.z];
    const threadHeight = 1000 * object.scale.y;
    const angleRad = THREE.Math.degToRad(rotationAngle);
    const shift = 30 + threadHeight * Math.sin(angleRad);
    this.setPosition(object, [shift, position[1], position[2]], scale, [
      rotation[0],
      rotation[1],
      angleRad,
    ], true);
  }


  addSuitcase() {
    this.suitcase = new THREE.Group();
    const object = this.objectLoader
      .getPreparedObjectWithMateral(Objects.SUITCASE.id)
      .clone();
    this.setPosition(object, [0, 0, 0], [1, 1, 1], [0, -20, 0]);
    this.suitcase.add(object);
    this.setPosition(
      this.suitcase,
      this.suitcaseStartPosition,
      [0, 0, 0],
      [0, 0, 0]
    );

    const modelBoundingBox = new THREE.Box3().setFromObject(object);
    this.suitcaseYSize = modelBoundingBox.max.y - modelBoundingBox.min.y;
  }

  suitcaseShowAnimationFunc(_el, _progress) {
    if (this.isSuitcaseApear) return;
    this.setPosition(
      this.suitcase,
      this.suitcaseStartPosition,
      [1, 1, 1],
      [0, 0, 0]
    );
  }

  suitcaseAppearenceAnimationFunc(_el, progress) {
    let y = this.suitcase.position.y;
    let scale = [1, 1, 1];

    const yScale =
      Math.pow(1 - progress, 3) +
      3 * Math.pow(1 - progress, 2) * progress * 1.4 +
      3 * (1 - progress) * Math.pow(progress, 2) * 0.6 +
      Math.pow(progress, 3);
    const diff = (yScale - 1) / 2;
    scale = [1 - diff, yScale, 1 - diff];
    const scaled = yScale * this.suitcaseYSize - this.suitcaseYSize;

    if (progress <= 0.65) {
      y = this.getSuitcaseStartPosition()[1] - 160 * progress - scaled;
    }

    if (progress === 1) {
      this.isSuitcaseApear = true;
      y = this.isPortrait() ? -757 : -830; //TODO
    }

    this.setPosition(this.suitcase, [-336, y, 750], scale, [0, 0, 0]);
  }

  chandlierMoveAnimationFunc(el, progress) {
    const rotation = this.chandlierAngle * Math.sin(6.3 * progress + Math.PI / 2);
    this.setRotateOfChandlier(el.element, rotation);
    const childRotatedObj = el.element.children.find((child) => child.name === `chandelierLathe`);
    const childRotation = 18 + 4 * Math.sin(6.3 * progress + 2 * Math.PI);
    childRotatedObj.rotation.set(0, 0, THREE.Math.degToRad(childRotation));
  }

  dogTailMoveAnimationFunc(el, progress) {
    let rotate;
    if (progress <= 0.2) {
      rotate = 8 * Math.sin(Math.PI * 5 * progress + Math.PI);
    } else if (progress > 0.2 && progress <= 0.3) {
      rotate = 15 * Math.sin(31.4 * progress);
    } else {
      const randomAmp = Math.floor(Math.random() * (12 - 9) + 9);
      rotate = randomAmp * Math.sin(Math.PI * 10 * progress);
    }
    const tailObj = el.element.children[0].children[0].children[0];
    const currentRotate = tailObj.rotation;
    tailObj.rotation.set(
      THREE.Math.degToRad(rotate),
      currentRotate.y,
      currentRotate.z
    );
  }
}
