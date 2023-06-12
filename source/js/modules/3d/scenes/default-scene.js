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
    this.initPreparedObjects();
  }

  setScenePosition() {
    this.setPosition(
      this.sceneGroup,
      SceneObjects[this.sceneId].position,
      SceneObjects[this.sceneId].scale,
      SceneObjects[this.sceneId].rotation
    );
  }

  initPrimitives() {
    SceneObjects[this.sceneId].primitives.forEach((el) => {
      const group = new THREE.Group();
      el.children.forEach((object) => {
        if (typeof THREE[object.primitiveType] === `function`) {
          const geometry = new THREE[object.primitiveType](
            ...object.primitiveSettings
          );
          const material = this.objectLoader.getMaterialByProps(
            object.materialType,
            object.materialProps
          );
          const mesh = new THREE.Mesh(
            geometry,
            (material && material.object) || this.baseMaterial
          );
          mesh.castShadow = true;
          mesh.receiveShadow = true;

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
      const material = this.objectLoader.getMaterialByProps(
        el.materialType,
        el.materialProps
      );
      const object = this.objectLoader.extrudeObject(
        el.id,
        el.extrudeSettings,
        (material && material.object) || this.baseMaterial
      );
      object.castShadow = true;
      object.receiveShadow = true;
      this.setPosition(object, el.position, el.scale, el.rotation);
      this.sceneGroup.add(object);
    });
  }

  initPreparedObjects() {
    SceneObjects[this.sceneId].objects.forEach((el) => {
      const object = this.objectLoader
        .getPreparedObjectWithMateral(el.id, el.materialType, el.materialProps)
        .clone();
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

  addToScene(scene) {
    this.scene = scene;
    this.setScenePosition(this.sceneGroup);
    this.scene.add(this.sceneGroup);
  }

  addFirstAnimatedObject() {
    const group = new THREE.Group();
    const objectConfig = SceneObjects[this.sceneId].animatedObjects[0];
    const object = this.objectLoader
      .getPreparedObjectWithMateral(objectConfig.id)
      .clone();
    this.setPosition(object, objectConfig.position, objectConfig.scale, objectConfig.rotation);
    group.add(object);
    this.sceneGroup.add(group);
  }
}
