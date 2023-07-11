import * as THREE from "three";
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
import { isMobile } from "../general/helpers";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    window.addEventListener(`resize`, () => this.setSizes());
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
    if (hasRenderImmediately) {
      this.stopAnimation();
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
    this.setSizes(false);
    this.cameraRig.position.set(this.defaultCameraPosition[0], this.defaultCameraPosition[1], this.defaultCameraPosition[2]);

    // const helper = new THREE.CameraHelper(cameraMain);
    // this.scene.add(helper);
    // this.camera = new THREE.PerspectiveCamera(
    //   this.fov,
    //   this.aspectRatio,
    //   this.near,
    //   15000
    // );
    // this.camera.position.set(
    //   -6000,
    //   5900,
    //   10000
    // );
    // this.controls = new OrbitControls(this.camera, this.canvas);
    // this.controls.addEventListener(`change`, () => {
    //   this.renderer.render(this.scene, this.camera);
    // });
    // this.controls.update();

    if (!isMobile()) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    await this.initObjects();
    this.initLight();
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
      [ThemeColor.BLUE]: new PyramidScene(this.objectLoader, this.aspectRatio),
      [ThemeColor.LIGHT_BLUE]: new SnowmanScene(this.objectLoader, this.aspectRatio),
      [ThemeColor.PURPLE]: new IIScene(this.objectLoader, this.aspectRatio),
    };

    this.sceneObjects[Screen.TOP] = {
      id: 0,
      scene: scenes[Screen.TOP],
      hue: 0.0,
      bubbles: [],
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
      ...scenes[Screen.TOP].animationObjects,
    };
    Object.entries(ThemeColor).forEach(([_key, value], index) => {
      this.sceneObjects[value] = {
        id: index + 1,
        scene: scenes[value] ? scenes[value] : null,
        hue: 0.0,
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
        ...this.getSceneObjectsSettings(index, scenes[value].animationObjects),
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
      sceneSettings.scene.addToScene(scenesObject);
    }
  }

  getSceneObjectsSettings(index, customSettings) {
    return index === 1
      ? {
          bubbles: this.getInitialBubblesPosition(),
          durations: [2000, 2500, 2700, 2800],
          finites: [false, true, true, true],
          delays: [0, 200, 700, 900],
          animationFunctions: [
            (progress) => this.hueBlinkAnimationFunc(progress),
            (progress) => this.firstBubbleMoveAnimationFunc(progress),
            (progress) => this.secondBubbleMoveAnimationFunc(progress),
            (progress) => this.thirdBubbleMoveAnimationFunc(progress),
          ],
        }
      : {
          bubbles: [],
          ...customSettings,
        };
  }

  getInitialBubblesPosition() {
    return [
      {
        center: { x: 0.45, y: -0.16 },
        radius: 0.08,
      },
      {
        center: { x: 0.3, y: -0.12 },
        radius: 0.06,
      },
      {
        center: { x: 0.49, y: -0.06 },
        radius: 0.03,
      },
    ];
  }

  renderSceneObject(sceneObjectId) {
    this.cameraAnimation = null;
    const introScene = this.sceneObjects[Screen.TOP] && this.sceneObjects[Screen.TOP].scene;
    const startMouseRelativeAngle = this.cameraRig.additionalAngleY;
    if (this.currentSceneObject === Screen.TOP && this.currentSceneObject !== sceneObjectId) {
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
    } else if (this.currentSceneObject !== Screen.TOP && sceneObjectId !== Screen.TOP && this.currentSceneObject !== sceneObjectId) {
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
    } else if (this.currentSceneObject !== Screen.TOP && sceneObjectId === Screen.TOP && this.currentSceneObject !== sceneObjectId) {
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
    this.renderer.render(this.scene, this.camera);
  }

  updateObjectsOnResize() {
    this.elements.forEach((el) => {
      el.animationFunctions.forEach((animation, index) => {
        if (el.finites[index]) animation(el, 1);
      });
    });
  }

  startAnimation(withoutCameraAnimation = false) {
    if (!this.animationsByScene[this.currentSceneObject]) {
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
    // if (this.runnungAnimation) {
    //   if (this.sceneObjects[this.currentSceneObject].bubbles.length) {
    //     this.sceneObjects[this.currentSceneObject].bubbles =
    //       this.getInitialBubblesPosition();
    //     this.sceneObjects[this.currentSceneObject].bubbles.forEach(
    //       (el, index) => {
    //         this.sceneObjects[
    //           this.currentSceneObject
    //         ].material.uniforms.bubbles.value[index] = {
    //           center: new THREE.Vector2(el.center.x, el.center.y),
    //           radius: el.radius,
    //         };
    //       }
    //     );
    //     this.sceneObjects[
    //       this.currentSceneObject
    //     ].material.uniforms.hue.value = 0.0;
    //     this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
    //   }
    // }
    this.elements.forEach((el) => {
      el.animationFunctions.forEach((animation, index) => {
        if (el.finites[index]) {
          el.isStopped = true;
        };
      });
    });
    super.stopAnimation();
  }

  clearScene() {}

  hueBlinkAnimationFunc(progress) {
    const hueForProgress =
      6 * Math.sin(6.3 * progress + 1.6) - 6 + Math.random();
    const hueRad = THREE.Math.degToRad(hueForProgress);
    this.sceneObjects[this.currentSceneObject].material.uniforms.hue.value =
      hueRad;
    this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
  }

  firstBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.sceneObjects[this.currentSceneObject].bubbles[0].radius
    );
    const newX =
      0.035 * Math.sin(15 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(0, newX, newY);
  }

  secondBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.sceneObjects[this.currentSceneObject].bubbles[1].radius
    );
    const newX =
      0.025 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(1, newX, newY);
  }

  thirdBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(
      progress,
      2 * this.sceneObjects[this.currentSceneObject].bubbles[2].radius
    );
    const newX =
      0.02 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(2, newX, newY);
  }

  getProgressedValue(progress, diameter) {
    return progress + diameter + diameter * progress;
  }

  bubbleMoveAnimation(index, curX, curY) {
    let [x, y] = [
      this.sceneObjects[this.currentSceneObject].bubbles[index].center.x,
      this.sceneObjects[this.currentSceneObject].bubbles[index].center.y,
    ];
    y += curY;
    x += curX;

    this.sceneObjects[this.currentSceneObject].material.uniforms.bubbles.value[
      index
    ].center = new THREE.Vector2(x, y);
    this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
  }
}
