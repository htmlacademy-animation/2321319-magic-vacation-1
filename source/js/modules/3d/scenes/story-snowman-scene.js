import * as THREE from "three";
import DefaultScene from "./default-scene";

export default class SnowmanScene extends DefaultScene {
  initObjects() {
    super.initObjects();
    this.initSnowman();
  }

  initSnowman() {
    this.snowman = new THREE.Group();
    let geometry = new THREE.SphereGeometry(44, 80, 80);
    let mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 173, 0);
    this.snowman.add(mesh);

    geometry = new THREE.SphereGeometry(75, 80, 80);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 65, 0);
    this.snowman.add(mesh);

    geometry = new THREE.ConeGeometry(18, 75, 80);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.rotation.set(0, 0, -Math.PI / 2);
    mesh.position.set(45, 173, 0);
    this.snowman.add(mesh);

    this.snowman.position.set(-62, -85, 25);
    this.snowman.scale.set(0.45, 0.45, 0.45);
    this.snowman.rotation.set(THREE.Math.degToRad(10), THREE.Math.degToRad(-45), 0);
    this.sceneGroup.add(this.snowman);
  }
}
