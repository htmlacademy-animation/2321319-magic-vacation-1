import * as THREE from "three";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  MaterialType,
  ObjectType,
  SvgShape,
  ObjectColor,
  Objects,
  ObjectLoadType
} from "../../../general/consts";
import {isMobile} from "../../../general/helpers";
import {SceneObjects} from "./scene-objects-config";
import {ExtrudeHelper} from "./helpers";

export default class ObjectLoader {
  constructor() {
    this._objectMap = {};
    this._materialMap = {};
    this._objectsCount = 0;
    this._preparedObjectsCount = 0;
  }

  async initObjects() {
    await Promise.allSettled([
      this._initImages(),
      this._initMaterial(),
      this._initPreparedObjects(),
      this._initSvgObjects()
    ]);
    this.extrudeHelper = new ExtrudeHelper(this._objectMap);
  }

  _triggerLoadEvent() {
    this._preparedObjectsCount += 1;
    const event = new CustomEvent(`3dObjectsLoadProgress`, {
      detail: {
        progress: Math.floor(this._preparedObjectsCount / this._objectsCount * 100)
      }
    });

    document.body.dispatchEvent(event);
  }

  async _initImages() {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const fetches = Object.values(SceneObjects).map((sceneConfig) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(sceneConfig.backgroundImage, resolve, reject);
      });
    });
    this._objectsCount += fetches.length;
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
              ObjectType.IMAGE,
              result.value,
              Object.keys(SceneObjects)[i]
          );
          this._triggerLoadEvent();
        }
      });
    });
  }

  async _initMaterial() {
    if (!isMobile()) {
      return;
    }
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const fetches = Object.values(MaterialType).filter((material) => material.id !== MaterialType.CUSTOM.id).map((material) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(material.matcapImg, resolve, reject);
      });
    });
    this._objectsCount += fetches.length;
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
              ObjectType.IMAGE,
              result.value,
              Object.keys(MaterialType)[i]
          );
          this._triggerLoadEvent();
        }
      });
    });
  }

  async _initPreparedObjects() {
    const objLoader = new OBJLoader();
    const gLTFLoader = new GLTFLoader();
    const fetches = Object.values(Objects).map((element) => {
      return new Promise((resolve, _reject) => {
        if (element.type === ObjectLoadType.OBJ) {
          objLoader.load(element.path, (result) => {
            resolve(result);
          });
        } else {
          gLTFLoader.load(element.path, (result) => {
            resolve(result.scene);
          });
        }
      });
    });
    this._objectsCount += fetches.length;
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
              ObjectType.OBJECT,
              result.value,
              Object.values(Objects)[i].id
          );
          this._triggerLoadEvent();
        }
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
    this._objectsCount += fetches.length;
    await Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          this._addObject(
              ObjectType.SVG,
              result.value,
              Object.values(SvgShape)[i].id
          );
          this._triggerLoadEvent();
        }
      });
    });
  }

  _addObject(objectType, data, key) {
    this._objectMap[key] = {
      type: objectType,
      object: data,
    };
  }

  getObjectsMap() {
    return this._objectMap;
  }

  getObjectByName(objectName) {
    return this._objectMap[objectName];
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
      } else if (isMobile() && Objects[objectName].type === ObjectLoadType.GLTF && child.isMesh) {
        const map = child.material.map;
        if (!map) {
          child.material = this.getMaterialByProps(MaterialType.BASIC.id, {color: child.material.color}, true).object;
        } else {
          child.material = new THREE.MeshBasicMaterial({color: child.material.color, map});
        }
      }
    });
    return object;
  }

  getMaterialMap() {
    return this._materialMap;
  }

  getMatcapForType(type) {
    return this.getObjectByName(type).object;
  }

  getMaterialByProps(materialType, materialProps, isNotInConfigColor = false) {
    if (!materialType || !materialProps) {
      return null;
    }

    const isCustomMatrial = materialType === MaterialType.CUSTOM.id;
    const key = isCustomMatrial
      ? `${materialType.toUpperCase()}_${materialProps.mainColor}-${materialProps.secondaryColor}`
      : `${materialType.toUpperCase()}_${isNotInConfigColor ? materialProps.color.getHexString() : materialProps.color.toUpperCase()}`;
    const materialFromMap = this._materialMap[key];
    if (materialFromMap) {
      return materialFromMap;
    }

    if (materialType === MaterialType.CUSTOM.id) {
      if (!isMobile()) {
        this._materialMap[key] = {
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
        return this._materialMap[key];
      }
      this._materialMap[key] = {
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
            this.getMatcapForType(MaterialType.SOFT.id)
        ),
      };
      return this._materialMap[key];
    } else {
      if (!isMobile()) {
        this._materialMap[key] = {
          type: materialType,
          color: materialProps.color,
          object: new THREE.MeshStandardMaterial({
            color: new THREE.Color(
                isNotInConfigColor ? materialProps.color : ObjectColor[materialProps.color].value
            ),
            transparent: !!materialProps.transparent,
            metalness: MaterialType[materialType].metalness,
            roughness: MaterialType[materialType].roughness,
            side: materialProps.side || THREE.FrontSide
          }),
        };
        return this._materialMap[key];
      }
    }
    this._materialMap[key] = {
      type: materialType,
      color: materialProps.color,
      object: new THREE.MeshMatcapMaterial({
        color: new THREE.Color(
            isNotInConfigColor ? materialProps.color : ObjectColor[materialProps.color].value
        ),
        matcap: this.getMatcapForType(materialType),
        side: materialProps.side || THREE.FrontSide
      }),
    };
    return this._materialMap[key];
  }
}
