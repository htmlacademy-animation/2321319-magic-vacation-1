import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MaterialType, ObjectType, SvgShape, ObjectColor } from "../../../general/consts";
import { SceneObjects } from "./scene-objects-config";
import { ExtrudeHelper } from "./helpers";

export default class ObjectLoader {
  constructor() {
    this.objectMap = {};
    this.materialMap = {};
  }

  async initObjects() {
    await this._initImages();
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
          this._addObject(ObjectType.IMAGE, result.value, Object.keys(SceneObjects)[i]);
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
          this._addObject(ObjectType.SVG, result.value, Object.values(SvgShape)[i].id);
        }
        // TODO: error handling
      });
    });
  }

  _addObject(objectType, data, key) {
    this.objectMap[key] = {
      type: objectType,
      object: data
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

  getMaterialMap() {
    return this.materialMap;
  }

  getMaterialByProps(materialType, materialColor) {
    if (!materialType || !materialColor) {
      return null;
    }
    const materialName = `${materialType.toUpperCase()}_${materialColor.toUpperCase()}`;
    const materialFromMap = this.materialMap[materialName];
    if (materialFromMap) {
      return materialFromMap;
    }
    this.materialMap[materialName] = {
      type: materialType,
      color: materialColor,
      object: new THREE.MeshStandardMaterial({
        color: new THREE.Color(ObjectColor[materialColor.toUpperCase()].value),
        metalness: MaterialType[materialType].metalness,
        roughness: MaterialType[materialType].roughness,
      })
    };
    return this.materialMap[materialName];
  }
}
