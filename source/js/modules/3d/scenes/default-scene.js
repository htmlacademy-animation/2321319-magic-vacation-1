import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";

export default class DefaultScene {
  constructor(objectLoader) {
    this.scene = null;
    this.objectLoader = objectLoader;
    this.sceneGroup = new THREE.Group();
    this.baseMaterial = new THREE.MeshNormalMaterial();
    this.sceneId = null;
  }

  initObjects() {
    if (this.sceneId === null) return;
    this.initPrimitives();
    this.initSvgObjects();
  }

  initPrimitives() {
    SceneObjects[this.sceneId].primitives.forEach((el) => {
      const group = new THREE.Group();
      el.children.forEach((object) => {
        if (typeof (THREE[object.primitiveType]) === `function`) {
          const geometry = new THREE[object.primitiveType](
            ...object.primitiveSettings
          );
          const mesh = new THREE.Mesh(geometry, this.baseMaterial);
          this.setPosition(
            mesh,
            object.position,
            object.scale,
            object.rotation
          );
          group.add(mesh);
        }
      });
      this.setPosition(group, el.position, el.scale, el.rotation);
      this.sceneGroup.add(group);
    });
  }

  initSvgObjects() {
    SceneObjects[this.sceneId].svgShapes.forEach((el) => {
      const object = this.objectLoader.extrudeObject(el.id, el.extrudeSettings);
      this.setPosition(object, el.position, el.scale, el.rotation);
      this.sceneGroup.add(object);
    });
  }

  setPosition(
    object,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0]
  ) {
    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(...rotation.map((deg) => THREE.Math.degToRad(deg)));
  }

  addToScene(
    scene,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0]
  ) {
    this.scene = scene;
    this.setPosition(this.sceneGroup, position, scale, rotation);
    this.scene.add(this.sceneGroup);
  }
}
