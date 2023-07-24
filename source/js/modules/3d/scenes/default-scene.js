import * as THREE from "three";
import {SceneObjects} from "../objects/scene-objects-config";

export default class DefaultScene {
  constructor(objectLoader, aspectRatio) {
    this.aspectRatio = aspectRatio;
    this.scene = null;
    this.objectLoader = objectLoader;
    this.sceneGroup = new THREE.Group();
    this.baseMaterial = new THREE.MeshNormalMaterial();
    this.sceneId = null;
  }

  initObjects() {
    if (this.sceneId === null) {
      return;
    }
    this.sceneGroup.name = this.sceneId;
    this.initPrimitives();
    this.initSvgObjects();
    this.initPreparedObjects();
  }

  isPortrait() {
    return this.aspectRatio < 1;
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
    SceneObjects[this.sceneId].primitives.forEach((element) => {
      const group = new THREE.Group();
      group.name = element.name || element.id;
      element.children.forEach((object) => {
        if (typeof THREE[object.primitiveType] === `function`) {
          const geometry = new THREE[object.primitiveType](...object.primitiveSettings);
          const material = this.objectLoader.getMaterialByProps(
              object.materialType,
              object.materialProps
          );
          const mesh = new THREE.Mesh(
              geometry,
              (material && material.object) || this.baseMaterial
          );
          mesh.name = object.name || object.id;
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
      this.setPosition(group, element.position, element.scale, element.rotation);
      this.sceneGroup.add(group);
    });
  }

  initSvgObjects() {
    SceneObjects[this.sceneId].svgShapes.forEach((element) => {
      const material = this.objectLoader.getMaterialByProps(
          element.materialType,
          element.materialProps
      );
      const object = this.objectLoader.extrudeObject(
          element.id,
          element.extrudeSettings,
          (material && material.object) || this.baseMaterial
      );
      object.castShadow = true;
      object.receiveShadow = true;
      this.createGroupWrapper(object, element);
    });
  }

  initPreparedObjects() {
    SceneObjects[this.sceneId].objects.forEach((element) => {
      if (element.isRiggingObject) {
        return;
      }
      const object = this.objectLoader
        .getPreparedObjectWithMateral(element.id, element.materialType, element.materialProps)
        .clone();
      object.name = element.name || element.id;
      this.createGroupWrapper(object, element);
    });
  }

  createGroupWrapper(targetObject, settings) {
    if (settings.hasGroupTransform) {
      this.setPosition(targetObject,
          settings.groupTransformSettings.objectPosition,
          settings.groupTransformSettings.objectScale,
          settings.groupTransformSettings.objectRotation
      );
      const group = new THREE.Group();
      group.name = settings.name || settings.id;
      const internalGroup = new THREE.Group();
      internalGroup.name = `internalGroup`;
      internalGroup.add(targetObject);
      this.setPosition(internalGroup,
          settings.groupTransformSettings.groupPosition,
          settings.groupTransformSettings.groupScale,
          settings.groupTransformSettings.groupRotation
      );
      group.add(internalGroup);
      this.setPosition(group, settings.position, settings.scale, settings.rotation);
      this.sceneGroup.add(group);
    } else {
      const group = new THREE.Group();
      group.name = settings.name || settings.id;
      group.add(targetObject);
      this.setPosition(group, settings.position, settings.scale, settings.rotation);
      this.sceneGroup.add(group);
    }
  }

  setPosition(
      object,
      position = [0, 0, 0],
      scale = [1, 1, 1],
      rotation = [0, 0, 0],
      notCastDegToRad = false
  ) {
    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(...rotation.map((angle) => notCastDegToRad ? angle : THREE.Math.degToRad(angle)));
  }

  addToScene(scene) {
    this.scene = scene;
    this.setScenePosition(this.sceneGroup);
    this.scene.add(this.sceneGroup);
  }

  onResizeUpdate(aspectRatio) {
    this.aspectRatio = aspectRatio;
  }
}
