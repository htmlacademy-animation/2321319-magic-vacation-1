import * as THREE from "three";

export default class DefaultScene {
  constructor() {
    this.scene = null;
    this.sceneGroup = new THREE.Group();
    this.baseMaterial = new THREE.MeshNormalMaterial();
  }

  initObjects() {

  }

  addToScene(scene, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) {
    this.scene = scene;
    this.sceneGroup.position.set(...position);
    this.sceneGroup.scale.set(...scale);
    this.sceneGroup.rotation.set(...rotation);
    this.scene.add(this.sceneGroup);
  }
}
