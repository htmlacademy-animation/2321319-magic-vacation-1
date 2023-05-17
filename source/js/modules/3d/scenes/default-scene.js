import * as THREE from "three";

export default class DefaultScene {
  constructor(objectLoader) {
    this.scene = null;
    this.objectLoader = objectLoader;
    this.sceneGroup = new THREE.Group();
    this.baseMaterial = new THREE.MeshNormalMaterial();
  }

  initObjects() {

  }

  setPosition(object, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) {
    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(...rotation);
  }

  addToScene(scene, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) {
    this.scene = scene;
    this.setPosition(this.sceneGroup, position, scale, rotation);
    this.scene.add(this.sceneGroup);
  }
}
