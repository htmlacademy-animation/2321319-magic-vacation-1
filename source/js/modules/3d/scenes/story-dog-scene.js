import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import { ThemeColor, Objects } from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class DogScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = ThemeColor.LIGHT_PURPLE;
  }

  initObjects() {
    super.initObjects();
    this.addDog();
    this.addSuitcase();
  }

  addDog() {
    this.addFirstAnimatedObject();
  }

  addSuitcase() {
    const group = new THREE.Group();
    const object = this.objectLoader
      .getPreparedObjectWithMateral(Objects.SUITCASE.id)
      .clone();
    this.setPosition(object, [0, 0, 0], [1, 1, 1], [0, -45, 0]);
    group.add(object);
    this.setPosition(group, [-336, -500, 756], [1, 1, 1], [0, 0, 0]);
    this.sceneGroup.add(group);

    // const geometry = new THREE.CircleGeometry(840, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    // const circle = new THREE.Mesh(geometry, material);
    // this.setPosition(circle, [0, -490, 0], [1, 1, 1], [90, 0, 45]);
    // this.sceneGroup.add(circle);
  }
}
