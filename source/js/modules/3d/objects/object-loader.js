import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OBJLoader  } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  MaterialType,
  ObjectType,
  SvgShape,
  ObjectColor,
  Objects,
  ObjectLoadType
} from "../../../general/consts";
import { SceneObjects } from "./scene-objects-config";
import { ExtrudeHelper } from "./helpers";

export default class ObjectLoader {
  constructor() {
    this.objectMap = {};
    this.materialMap = {};
  }

  async initObjects() {
    await this._initImages();
    await this._initPreparedObjects();
    await this._initSvgObjects();
    this.extrudeHelper = new ExtrudeHelper(this.objectMap);
  }

  async _initImages() {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const fetches = Object.values(SceneObjects).map((sceneConfig) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(sceneConfig.backgroundImage, resolve, reject);
      });
    });
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
            ObjectType.IMAGE,
            result.value,
            Object.keys(SceneObjects)[i]
          );
        }
        // TODO: error handling
      });
    });
  }

  async _initPreparedObjects() {
    const objLoader = new OBJLoader();
    const gLTFLoader = new GLTFLoader();
    const fetches = Object.values(Objects).map((el) => {
      return new Promise((resolve, _reject) => {
        if (el.type === ObjectLoadType.OBJ) {
          objLoader.load(el.path, (result) => {
            resolve(result);
          });
        } else {
          gLTFLoader.load(el.path, (result) => {
            resolve(result.scene);
          });
        }
      });
    });
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
            ObjectType.OBJECT,
            result.value,
            Object.values(Objects)[i].id
          );
        }
        // TODO: error handling
      });
    });
  }

  async _initSvgObjects() {
    const svgLoader = new SVGLoader();
    const fetches = Object.values(SvgShape).map((svg) => {
      return new Promise((resolve, _reject) => {
        svgLoader.load(svg.path, (result) => {
          resolve(result.paths);
        });
      });
    });
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
            ObjectType.SVG,
            result.value,
            Object.values(SvgShape)[i].id
          );
        }
        // TODO: error handling
      });
    });
  }

  _addObject(objectType, data, key) {
    this.objectMap[key] = {
      type: objectType,
      object: data,
    };
  }

  getObjectsMap() {
    return this.objectMap;
  }

  getObjectByName(objectName) {
    return this.objectMap[objectName];
  }

  extrudeObject(objectName, settings, material) {
    return this.extrudeHelper.extrudeObject(objectName, settings, material);
  }

  getPreparedObjectWithMateral(objectName, materialType, materialProps) {
    const object = this.getObjectByName(objectName).object;

    const material = this.getMaterialByProps(materialType, materialProps);
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (Objects[objectName].type === ObjectLoadType.OBJ && child.isMesh) {
        child.material = material.object;
      }
    });
    return object;
  }

  getMaterialMap() {
    return this.materialMap;
  }

  getMaterialByProps(materialType, materialProps) {
    if (!materialType || !materialProps) {
      return null;
    }

    const isCustomMatrial = materialType === MaterialType.CUSTOM.id;
    const key = isCustomMatrial
      ? `${materialType.toUpperCase()}_${materialProps.mainColor}-${materialProps.secondaryColor}` 
      : `${materialType.toUpperCase()}_${materialProps.color.toUpperCase()}`;
    const materialFromMap = this.materialMap[key];
    if (materialFromMap) {
      return materialFromMap;
    }

    if (materialType === MaterialType.CUSTOM.id) {
      this.materialMap[key] = {
        type: materialType,
        color: `${materialProps.mainColor}-${materialProps.secondaryColor}`,
        object: new materialProps[`materialConstructor`](
          new THREE.Color(
            ObjectColor[materialProps.mainColor].value
          ),
          new THREE.Color(
            ObjectColor[materialProps.secondaryColor].value
          ),
          materialProps.textureFrequency,
          MaterialType.SOFT.metalness,
          MaterialType.SOFT.roughness,
        ),
      };
      return this.materialMap[key];
    } else {
      this.materialMap[key] = {
        type: materialType,
        color: materialProps.color,
        object: new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            ObjectColor[materialProps.color].value
          ),
          metalness: MaterialType[materialType].metalness,
          roughness: MaterialType[materialType].roughness,
          side: materialProps.side || THREE.FrontSide
        }),
      };
      return this.materialMap[key];
    }
  }
}
