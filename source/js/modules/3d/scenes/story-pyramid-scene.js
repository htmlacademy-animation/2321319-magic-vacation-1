import * as THREE from "three";
import DefaultScene from "./default-scene";

export default class PyramidScene extends DefaultScene {
  initObjects() {
    super.initObjects();
    this.initPyramid();
    this.initFlashlight();
  }

  initPyramid() {
    this.pyramid = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(0, 125, 280, 4, 1);
    let mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 0, 0);
    this.pyramid.add(mesh);

    this.pyramid.position.set(-10, -35, 12);
    this.pyramid.scale.set(0.65, 0.45, 0.65);
    this.pyramid.rotation.set(THREE.Math.degToRad(10), 0, 0);
    this.sceneGroup.add(this.pyramid);
  }

  initFlashlight() {
    this.flashlight = new THREE.Group();
    let geometry = new THREE.CylinderGeometry(16, 16, 120, 80, 1);
    let mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 0, 0);
    this.flashlight.add(mesh);

    geometry = new THREE.SphereGeometry(16, 80, 80);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 60, 0);
    this.flashlight.add(mesh);

    geometry = new THREE.CylinderGeometry(7, 7, 230, 80, 1);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 183, 0);
    this.flashlight.add(mesh);

    geometry = new THREE.BoxGeometry(37, 4, 37);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 298, 0);
    this.flashlight.add(mesh);

    geometry = new THREE.CylinderGeometry(21, 17, 60, 4, 1);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 330, 0);
    mesh.rotation.set(0, Math.PI / 4, 0);
    this.flashlight.add(mesh);

    geometry = new THREE.CylinderGeometry(22.5, 28.5, 6, 4, 1);
    mesh = new THREE.Mesh(geometry, this.baseMaterial);
    mesh.position.set(0, 363, 0);
    mesh.rotation.set(0, Math.PI / 4, 0);
    this.flashlight.add(mesh);

    this.flashlight.position.set(185, -105, 20);
    this.flashlight.scale.set(0.5, 0.5, 0.5);
    this.flashlight.rotation.set(THREE.Math.degToRad(15), THREE.Math.degToRad(10), THREE.Math.degToRad(1));
    this.sceneGroup.add(this.flashlight);
  }
}
