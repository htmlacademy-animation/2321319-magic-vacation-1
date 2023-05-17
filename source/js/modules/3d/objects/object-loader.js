import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { ObjectType, SvgShape, SceneImage } from "../../../general/consts";
import ExtrudeHelper from "./extrude-helper";

export default class ObjectLoader {
  constructor() {
    this.objectMap = {};
  }

  async initObjects() {
    await this._initImages();
    await this._initSvgObjects();
    this.extrudeHelper = new ExtrudeHelper(this.objectMap);
  }

  async _initImages() {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const fetches = Object.values(SceneImage).map((texture) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(texture, resolve, reject);
      });
    });
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(ObjectType.IMAGE, result.value, i);
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
          this._addObject(ObjectType.SVG, result.value, i);
        }
        // TODO: error handling
      });
    });
  }

  _addObject(objectType, data, index) {
    const config = objectType === ObjectType.SVG ? SvgShape : SceneImage;
    const key = Object.keys(config)[index];
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

  extrudeObject(objectName, settings) {
    return this.extrudeHelper.extrudeObject(objectName, settings);
  }
}
