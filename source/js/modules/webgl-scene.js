import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import CustomMaterial from "./3d/materials/custom-material";
import { Screen, ThemeColor, AnimationType } from "../general/consts";
import ObjectLoader from "./3d/objects/object-loader";
import PyramidScene from "./3d/scenes/story-pyramid-scene";
import SnowmanScene from "./3d/scenes/story-snowman-scene";
import CameraRig from "./3d/objects/camera-rig";
import IntroScene from "./3d/scenes/intro-scene";
import DogScene from "./3d/scenes/story-dog-scene";
import IIScene from "./3d/scenes/story-ii-scene";
import CanvasAnimation from "./canvas-animation";
import { SceneObjects } from "./3d/objects/scene-objects-config";
import { easeInQuad } from "../general/easing";
import { isMobile, debounce } from "../general/helpers";

export default class WebGLScene extends CanvasAnimation {
  constructor(canvasElement) {
    super(canvasElement, 60, AnimationType._3D);
    this.storyScenes = null;
    this.sceneObjects = {};
    this.alpha = 1;
    this.backgroundColor = `#5f458c`;
    this.isLoading = true;
    this.currentSceneObject = null;
    this.previousSceneObject = null;
    this.animationsByScene = {};

    const debouncedFunction = debounce(this.setSizes.bind(this), 200);
    super.removeEventListeners();
    window.addEventListener(`resize`, debouncedFunction);
    window.addEventListener(`mousemove`, (e) => this.mouseMoveHandler(e));

    this.init();
  }

  initCameraSettings() {
    this.aspectRatio = this.canvasWidth / this.canvasHeight;
    this.near = 100;
    this.far = 4675;

    const portraitFov = 80 - 30 * this.aspectRatio;
    let landscapeFov = 50 - 10 * this.aspectRatio;
    landscapeFov = landscapeFov < 33 ? 33 : landscapeFov;
    this.fov = this.isLandscape() ? landscapeFov : portraitFov;
    this.defaultCameraPosition = [0, 920, 0];
  }

  setSizes(hasRenderImmediately = true) {
    super.setSizes();
    this.initCameraSettings();
    this.camera.aspect = this.aspectRatio;
    this.camera.near = this.near;
    this.camera.far = this.far;
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.composer.setPixelRatio(window.devicePixelRatio);
    this.composer.setSize(this.canvasWidth, this.canvasHeight);
    if (hasRenderImmediately) {
      this.stopAnimation();
      this.customMaterial.uniforms.canvasSize.value = new THREE.Vector2(this.canvasWidth, this.canvasHeight);
      this.customMaterial.needsUpdate = true;
      Object.values(ThemeColor).forEach((key, index) => {
        this.sceneObjects[key].cameraSettings.x = this.defaultCameraPosition[0];
        this.sceneObjects[key].cameraSettings.angleY = this.getAngleY();
        this.sceneObjects[key].cameraSettings.targetForLookY = this.getTargetY();
        this.sceneObjects[key].cameraSettings.cameraRotationX = this.getTargetX();
      });
      this.cameraRig.position.x = this.currentSceneObject === Screen.TOP ? 0 : this.defaultCameraPosition[0];
      this.sceneGroup.position.y = this.getRoomCompositionY();
      this.cameraRig.angleY = this.currentSceneObject === Screen.TOP ? 0 : this.getAngleY();
      this.cameraRig.targetForLookY = this.currentSceneObject === Screen.TOP ? 920 : this.getTargetY();
      this.cameraRig.cameraRotationX = this.currentSceneObject === Screen.TOP ? 0 : this.getTargetX();
     
      this.cameraRig.invalidate();
      Object.values(this.sceneObjects).forEach((el) => {
        el.scene.onResizeUpdate(this.aspectRatio);
      });
      this.render();
      this.updateObjectsOnResize();
      this.startAnimation(true);
    }
  }

  async init() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: `high-performance`,
      logarithmicDepthBuffer: true,
    });
    this.setColor();

    const cameraMain = new THREE.PerspectiveCamera(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far
    );
    this.cameraRig = new CameraRig(cameraMain);
    this.scene.add(this.cameraRig);
    this.camera = cameraMain;
    this.composer = new EffectComposer(this.renderer);
    this.setSizes(false);
    this.initPass();
    this.cameraRig.position.set(this.defaultCameraPosition[0], this.defaultCameraPosition[1], this.defaultCameraPosition[2]);

    if (!isMobile()) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    await this.initObjects();
    this.initLight();
    this.triggerLoadedEvent();
  }

  initPass() {
    const renderPass = new RenderPass(this.scene, this.camera);
    this.customMaterial = new CustomMaterial(
      new THREE.Vector2(this.canvas.width, this.canvas.height),
      this.scene,
      THREE.Math.degToRad(0),
      0,
      []
    );
    const effectPass = new ShaderPass(this.customMaterial, `map`);
    this.composer.addPass(renderPass);
    this.composer.addPass(effectPass);
  }

  initLight() {
    if (isMobile()) return;
    const lightDirection = new THREE.DirectionalLight(0xffffff, 0.84);
    const directionalLightZ = this.far;
    lightDirection.position.set(0, 0, directionalLightZ);
    this.cameraRig.addObjectToGroupRotation(lightDirection);

    const relatedCameraLight = new THREE.Group();
    const lightPoint1 = new THREE.PointLight(0xf6f2ff, 1.0, 2600, 2);
    lightPoint1.position.set(-785, -350, -710);
    this.setShadowSettings(lightPoint1);
    relatedCameraLight.add(lightPoint1);

    const lightPoint2 = new THREE.PointLight(0xf5feff, 3.5, 2500, 2);
    lightPoint2.position.set(730, 800, -985);
    this.setShadowSettings(lightPoint2);
    relatedCameraLight.add(lightPoint2);
    relatedCameraLight.position.set(0, 0, this.sceneObjects[ThemeColor.LIGHT_PURPLE].cameraSettings.z);
    this.cameraRig.addObjectToGroupRotation(relatedCameraLight);
  }

  setShadowSettings(light) {
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 100;
    light.shadow.camera.far = 3500;
    light.shadow.camera.visible = true;
  }

  async initObjects() {
    this.objectLoader = new ObjectLoader();
    await this.objectLoader.initObjects();
    this.initScenesSettings();

    this.sceneGroup = new THREE.Group();
    this.sceneGroup.name = `RoomsComposition`;
    Object.entries(this.sceneObjects).map(([key, _value]) => {
      this.init3dSceneObjects(key, +key === Screen.TOP ? this.scene : this.sceneGroup);
    });
    this.sceneGroup.position.y = this.getRoomCompositionY();
    this.scene.add(this.sceneGroup);

    this.isLoading = false;
    if (this.currentSceneObject !== null) {
      this.renderSceneObject(this.currentSceneObject);
    }
  }

  triggerLoadedEvent() {
    const event = new CustomEvent(`3dObjectsLoad`, {
      detail: {
        success: true
      }
    });

    document.body.dispatchEvent(event);
  }

  isLandscape() {
    return this.aspectRatio > 1;
  }

  getRoomCompositionY() {
    return this.isLandscape() ? 185 : 258;
  }

  getAngleY() {
    return this.isLandscape() ? -15 : -20;
  }

  getTargetY() {
    return this.isLandscape() ? 130 : -160;
  }

  initScenesSettings() {
    const scenes = {
      [Screen.TOP]: new IntroScene(this.objectLoader, this.aspectRatio),
      [ThemeColor.LIGHT_PURPLE]: new DogScene(this.objectLoader, this.aspectRatio),
      [ThemeColor.BLUE]: new PyramidScene(this.objectLoader, this.aspectRatio, this.customMaterial),
      [ThemeColor.LIGHT_BLUE]: new SnowmanScene(this.objectLoader, this.aspectRatio),
      [ThemeColor.PURPLE]: new IIScene(this.objectLoader, this.aspectRatio),
    };

    this.sceneObjects[Screen.TOP] = {
      id: 0,
      scene: scenes[Screen.TOP],
      cameraSettings: {
        x: 0,
        y: this.defaultCameraPosition[1],
        z: 4675,
        angleY: 0,
        angleX: 0,
        cameraRotationX: 0,
        targetForLookY: 920,
        targetForLookZ: 3270
      },
    };
    Object.entries(ThemeColor).forEach(([_key, value], index) => {
      this.sceneObjects[value] = {
        id: index + 1,
        scene: scenes[value] ? scenes[value] : null,
        cameraSettings: {
          x: this.defaultCameraPosition[0],
          y: this.defaultCameraPosition[1],
          z: 2260,
          angleY: this.getAngleY(),
          angleX: SceneObjects[value].rotation[1],
          cameraRotationX: this.getTargetX(),
          targetForLookY: this.getTargetY(),
          targetForLookZ: 0
        },
      };
    });
  }

  getTargetX() {
    return this.isLandscape() ? 0 : THREE.Math.degToRad(5);
  }

  init3dSceneObjects(sceneKey, scenesObject) {
    const sceneSettings = this.sceneObjects[sceneKey];
    if (sceneSettings.scene) {
      sceneSettings.scene.initObjects();
      if (sceneKey === ThemeColor.LIGHT_PURPLE) {
        this.cameraRig.addObjectToGroupRotation(sceneSettings.scene.suitcase);
      }
      if (sceneKey === ThemeColor.BLUE) {
        sceneSettings.scene.updateUniforms();
      }
      sceneSettings.scene.addToScene(scenesObject);
    }
  }

  renderSceneObject(sceneObjectId) {
    this.cameraAnimation = null;
    const introScene = this.sceneObjects[Screen.TOP] && this.sceneObjects[Screen.TOP].scene;
    const startMouseRelativeAngle = this.cameraRig.additionalAngleY;
    if (this.currentSceneObject !== null && this.currentSceneObject === Screen.TOP && this.currentSceneObject !== sceneObjectId) {
      this.cameraAnimation = {
        element: null,
        status: true,
        durations: [1000, 1000, 600, 300],
        finites: [true, true, true, true],
        delays: [0, 1000, 200, 0],
        animationFunctions: [
          (el, progress) => this.cameraAnimationMove(el, progress),
          (el, progress) => this.cameraAnimationRotate(el, progress),
          (el, progress) => introScene.planeOpacityAnimationFunc(introScene.sceneGroup.children[0].children[0], progress),
          (el, progress) => this.resetAngleForMouseEvents(el, progress, startMouseRelativeAngle)
        ],
      };
    } else if (this.currentSceneObject !== null && this.currentSceneObject !== Screen.TOP && sceneObjectId !== Screen.TOP && this.currentSceneObject !== sceneObjectId) {
      this.cameraAnimation = {
        element: null,
        status: true,
        durations: [1000, 100, 300],
        finites: [true, true, true],
        delays: [0, 200, 0],
        animationFunctions: [
          (el, progress) => this.cameraAnimationRotate(el, progress),
          (el, progress) => introScene.planeOpacityAnimationFunc(introScene.sceneGroup.children[0].children[0], progress, false),
          (el, progress) => this.resetAngleForMouseEvents(el, progress, startMouseRelativeAngle)
        ],
      };
    } else if (this.currentSceneObject && this.currentSceneObject !== Screen.TOP && sceneObjectId === Screen.TOP && this.currentSceneObject !== sceneObjectId) {
      this.cameraAnimation = {
        element: null,
        status: true,
        durations: [800, 100, 300, 100],
        finites: [true, true, true, true],
        delays: [0, 700, 0, 900],
        animationFunctions: [
          (el, progress) => this.cameraBackAnimation(el, progress),
          (el, progress) => introScene.planeOpacityAnimationFunc(introScene.sceneGroup.children[0].children[0], progress, false),
          (el, progress) => this.resetAngleForMouseEvents(el, progress, startMouseRelativeAngle),
          () => this.setCameraPositionWithoutAnimation(sceneObjectId) // TODO
        ],
      };
    } else {
      if (!this.isLoading) this.setCameraPositionWithoutAnimation(sceneObjectId);
    }
    this.previousSceneObject = this.currentSceneObject;
    this.currentSceneObject = sceneObjectId;
    if (this.isLoading) {
      return;
    }

    this.render();
    this.startAnimation();
  }

  cameraBackAnimation(el, progress) {
    this.cameraRig.zShift = 2260 + 2415 * progress;
    this.cameraRig.targetForLookY = this.isLandscape() ? 130 + 790 * progress : -160 + 1080 * progress;
    // this.cameraRig.targetForLookZ = this.sceneObjects[Screen.TOP].cameraSettings.targetForLookZ * progress; // TODO
    const diffX = this.sceneObjects[this.previousSceneObject].cameraSettings.cameraRotationX - this.sceneObjects[this.currentSceneObject].cameraSettings.cameraRotationX;
    this.cameraRig.cameraRotationX = diffX * (1 - progress);
    const angle = this.sceneObjects[this.previousSceneObject].cameraSettings.angleY;
    this.cameraRig.angleY = THREE.Math.degToRad(angle * easeInQuad(1 - progress));
    // console.log(this.cameraRig.targetForLookY)
    this.cameraRig.angleX = THREE.Math.degToRad(this.sceneObjects[this.previousSceneObject].cameraSettings.angleX * (1 - progress));
    this.cameraRig.invalidate();
  }

  resetAngleForMouseEvents(el, progress, startValue) {
    this.cameraRig.additionalAngleY = startValue - startValue * progress;
    this.cameraRig.invalidate();
  }

  mouseMoveHandler(e) {
    const windowHeight = window.innerHeight;
    const mouseY = (2 * e.pageY / windowHeight) - 1;
    this.cameraRig.additionalAngleY = 25 * mouseY;
    this.cameraRig.invalidate();
  }

  setColor() {
    this.color = new THREE.Color(this.backgroundColor);
    this.renderer.setClearColor(this.color, this.alpha);
  }

  cameraAnimationMove(object, progress) {
    this.cameraRig.zShift = 4675 - 2415 * progress;
    const angle = this.sceneObjects[ThemeColor.LIGHT_PURPLE].cameraSettings.angleY;
    this.cameraRig.targetForLookY = this.isLandscape()
      ? this.defaultCameraPosition[1] - 790 * easeInQuad(progress)
      : this.defaultCameraPosition[1] - 1080 * easeInQuad(progress);

    const diffX = this.sceneObjects[this.currentSceneObject].cameraSettings.cameraRotationX - this.sceneObjects[this.previousSceneObject].cameraSettings.cameraRotationX;
    this.cameraRig.targetForLookZ = 3270 - 3270 * easeInQuad(progress);
    this.cameraRig.cameraRotationX = diffX * easeInQuad(progress);
    this.cameraRig.angleY = THREE.Math.degToRad(angle * easeInQuad(progress));
    this.cameraRig.invalidate();
  }

  cameraAnimationRotate(object, progress) {
    const targetDegree = this.sceneObjects[this.currentSceneObject].cameraSettings.angleX;
    const currentDegree = this.sceneObjects[this.previousSceneObject].cameraSettings.angleX;
    const diff = currentDegree - targetDegree;
    if (diff !== 0) {
      const newDegree = currentDegree - diff * progress;
      this.cameraRig.angleX = THREE.Math.degToRad(newDegree);
    }

    this.cameraRig.invalidate();
  }

  getCoordinateForAnimation(prevCoordinate, currentCoordinate, progress) {
    if (currentCoordinate !== prevCoordinate) {
      return currentCoordinate > prevCoordinate
      ? prevCoordinate + (currentCoordinate - prevCoordinate) * progress
      : prevCoordinate - (prevCoordinate - currentCoordinate) * progress;
    }
    return currentCoordinate;
  }

  setCameraPositionWithoutAnimation(sceneObjectId) {
    const sceneCameraSettings = this.sceneObjects[sceneObjectId].cameraSettings;
    this.cameraRig.zShift = sceneCameraSettings.z;
    this.cameraRig.targetForLookY = this.sceneObjects[sceneObjectId].cameraSettings.targetForLookY;
    this.cameraRig.angleY = THREE.Math.degToRad(sceneCameraSettings.angleY);
    this.cameraRig.angleX = THREE.Math.degToRad(sceneCameraSettings.angleX);
    this.cameraRig.additionalAngleY = 0;
    this.cameraRig.targetForLookZ = this.sceneObjects[sceneObjectId].cameraSettings.targetForLookZ;
    this.cameraRig.cameraRotationX = this.sceneObjects[sceneObjectId].cameraSettings.cameraRotationX;
    this.cameraRig.invalidate();
  }

  render() {
    this.composer.render();
  }

  updateObjectsOnResize() {
    this.elements.forEach((el) => {
      el.animationFunctions.forEach((animation, index) => {
        if (el.finites[index]) animation(el, 1);
      });
    });
    if (this.currentSceneObject !== ThemeColor.LIGHT_PURPLE) this.sceneObjects[ThemeColor.LIGHT_PURPLE].scene.suitcaseAppearenceAnimationFunc(null, 1);
  }

  startAnimation(withoutCameraAnimation = false) {
    if (!this.animationsByScene[this.currentSceneObject] || this.currentSceneObject === ThemeColor.BLUE) {
      this.initAnimations();
    }
    const animationsByCurrentScene = this.animationsByScene[this.currentSceneObject];
    this.elements = animationsByCurrentScene;
    animationsByCurrentScene.forEach((element, indexOfElement) => {
      element.animationFunctions.forEach((f, index) => {
        if (element.finites[index] && element.isStopped) {
          this.elements[indexOfElement].durations[index] = 0;
          f(element, 1);
        }
      });
    });
    if (this.cameraAnimation && !withoutCameraAnimation) {
      this.elements = [...this.elements, this.cameraAnimation];
    }
    super.startAnimation();
  }

  initAnimations() {
    const scene = this.sceneObjects[this.currentSceneObject].scene;
    this.animationsByScene[this.currentSceneObject] = [
      ...SceneObjects[this.currentSceneObject].primitives,
      ...SceneObjects[this.currentSceneObject].svgShapes,
      ...SceneObjects[this.currentSceneObject].objects,
    ].filter((el) => {
      return !!scene.animationObjects[el.name] || !!scene.animationObjects[el.id];
    }).map((el) => {
      const settings = scene.animationObjects[el.name] || scene.animationObjects[el.id];
      const object = scene.sceneGroup.children.find((obj) => obj.name === el.name || obj.name === el.id) || {};
      return {element: object, ...settings, status: true};
    });
    if (this.currentSceneObject === ThemeColor.BLUE) {
      this.animationsByScene[this.currentSceneObject] = [
        ...this.animationsByScene[this.currentSceneObject],
        {
          element: null,
          status: true,
          ...scene.getCustomMaterialSceneSettings()
        }
      ];
    }
  }

  prepareAnimationTick(now, elapsed) {
    super.prepareAnimationTick(now, elapsed);
    this.render();
  }

  runAnimationTick(el, animations) {
    animations.forEach((animation, _index) => {
      animation.animationFunction(el, animation.progress);
    });
  }

  stopAnimation() {
    if (this.runnungAnimation) {
      if (this.previousSceneObject === ThemeColor.BLUE) {
        this.sceneObjects[ThemeColor.BLUE].scene.updateUniforms();
      }
    }
    if (this.elements && this.elements.length) {
    this.elements.forEach((el) => {
      el.animationFunctions.forEach((animation, index) => {
        if (el.finites[index]) {
          el.isStopped = true;
        }
      });
    });
    super.stopAnimation();
    }
  }

  clearScene() {}
}
