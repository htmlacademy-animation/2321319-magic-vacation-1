import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import { ThemeColor, Objects } from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class DogScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = ThemeColor.LIGHT_PURPLE;
    this.suitcaseStartPosition = [-336, -380, 756];
    this.initAnimationsSettings();
  }

  initObjects() {
    super.initObjects();
    this.addDog();
    this.addSuitcase();
  }

  initAnimationsSettings() {
    this.animationObjects = {
      [Objects.SUITCASE.id]: {
        durations: [10, 800],
        finites: [true, true],
        delays: [400, 500],
        animationFunctions: [
          (el, progress) => this.suitcaseShowAnimationFunc(el, progress),
          (el, progress) => this.suitcaseAppearenceAnimationFunc(el, progress),
        ],
      },
    };
  }

  addDog() {
    this.addFirstAnimatedObject();
  }

  addSuitcase() {
    this.suitcase = new THREE.Group();
    const object = this.objectLoader
      .getPreparedObjectWithMateral(Objects.SUITCASE.id)
      .clone();
    this.setPosition(object, [0, 0, 0], [1, 1, 1], [0, -45, 0]);
    this.suitcase.add(object);
    this.setPosition(
      this.suitcase,
      this.suitcaseStartPosition,
      [0, 0, 0],
      [0, 0, 0]
    );
    this.sceneGroup.add(this.suitcase);

    const modelBoundingBox = new THREE.Box3().setFromObject(object);
    this.suitcaseYSize = modelBoundingBox.max.y - modelBoundingBox.min.y;

    // const geometry = new THREE.CircleGeometry(840, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    // const circle = new THREE.Mesh(geometry, material);
    // this.setPosition(circle, [0, -490, 0], [1, 1, 1], [90, 0, 45]);
    // this.sceneGroup.add(circle);
  }

  suitcaseShowAnimationFunc(_el, _progress) {
    this.setPosition(this.suitcase, this.suitcaseStartPosition, [1, 1, 1], [0, 0, 0]);
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
      y = -380 - 160 * progress - scaled;
    }

    this.setPosition(this.suitcase, [-336, y, 756], scale, [0, 0, 0]);
  }
}
