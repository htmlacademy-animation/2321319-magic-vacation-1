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
import { easeInExpo } from "../general/easing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class WebGLScene extends CanvasAnimation {
  constructor(canvasElement) {
    super(canvasElement, 60, AnimationType._3D);
    super.setSizes();
    this.aspectRatio = this.canvas.width / this.canvas.height;
    this.storyScenes = null;
    this.sceneObjects = {};
    this.alpha = 1;
    this.backgroundColor = `#5f458c`;
    this.near = 0.1;
    this.far = 4675;
    this.fov = 35;
    this.isLoading = true;
    this.currentSceneObject = null;
    this.previousSceneObject = null;

    window.addEventListener(`resize`, () => this.setSizes());
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: `high-performance`,
      logarithmicDepthBuffer: true,
    });

    const cameraMain = new THREE.PerspectiveCamera(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far
    );
    this.cameraRig = new CameraRig(cameraMain);
    this.cameraRig.position.set(0, 920, 0);
    this.scene.add(this.cameraRig);
    this.camera = cameraMain;

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

    this.setColor();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    // if (!this.isMobile()) {
    //   this.renderer.shadowMap.enabled = true;
    //   this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // }

    this.initLight();
    this.initObjects();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  initLight() {
    const light = new THREE.Group();

    // const lightDirection = new THREE.DirectionalLight(0xffffff, 0.84);
    // lightDirection.position.set(
    //   this.camera.position.x,
    //   this.camera.position.y,
    //   this.camera.position.z
    // );
    // const targetForLight = new THREE.Object3D();
    // const targetY =
    //   this.camera.position.z * Math.tan(THREE.Math.degToRad(15.0));
    // targetForLight.position.set(0, targetY, 0);
    // this.scene.add(targetForLight);
    // lightDirection.target = targetForLight;
    // light.add(lightDirection);

    // const lightHelper = new THREE.DirectionalLightHelper(lightDirection, 10);
    // this.scene.add(lightHelper);

    // const lightPoint1 = new THREE.PointLight(0xf6f2ff, 1.0, 2600, 2);
    // lightPoint1.position.set(-785, -350, -710);
    // this.setShadowSettings(lightPoint1);

    // const lightHelper1 = new THREE.PointLightHelper(lightPoint1, 10);
    // this.scene.add(lightHelper1);

    // light.add(lightPoint1);

    // const lightPoint2 = new THREE.PointLight(0xf5feff, 3.5, 2500, 2);
    // lightPoint2.position.set(730, 800, -985);
    // this.setShadowSettings(lightPoint2);

    // const lightHelper2 = new THREE.PointLightHelper(lightPoint2, 10);
    // this.scene.add(lightHelper2);

    // light.add(lightPoint2);

    // TODO: удалить после окончательной постановки света
    const lightForTesting = new THREE.AmbientLight(`0xFFFF`, 1.0);
    light.add(lightForTesting);

    light.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    this.scene.add(light);
  }

  setShadowSettings(light) {
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
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
    this.sceneGroup.position.y = 200;
    this.scene.add(this.sceneGroup);

    this.isLoading = false;
    if (this.currentSceneObject !== null) {
      this.renderSceneObject(this.currentSceneObject);
    }
  }

  initScenesSettings() {
    const scenes = {
      [Screen.TOP]: new IntroScene(this.objectLoader),
      [ThemeColor.LIGHT_PURPLE]: new DogScene(this.objectLoader),
      [ThemeColor.BLUE]: new PyramidScene(this.objectLoader),
      [ThemeColor.LIGHT_BLUE]: new SnowmanScene(this.objectLoader),
      [ThemeColor.PURPLE]: new IIScene(this.objectLoader),
    };

    // TODO: отказаться от этого объекта в пользу SceneObject
    this.sceneObjects[Screen.TOP] = {
      scene: scenes[Screen.TOP],
      hue: 0.0,
      bubbles: [],
      cameraSettings: {
        x: 0,
        y: 920,
        z: 4675,
        angleY: 0,
        angleX: 0
      },
      ...scenes[Screen.TOP].animationObjects,
    };
    Object.entries(ThemeColor).forEach(([_key, value], index) => {
      this.sceneObjects[value] = {
        scene: scenes[value] ? scenes[value] : null,
        hue: 0.0,
        cameraSettings: {
          x: 0,
          y: 920,
          z: 2260,
          angleY: -15,
          angleX: SceneObjects[value].rotation[1]
        },
        ...this.getSceneObjectsSettings(index, scenes[value].animationObjects),
      };
    });
  }

  init3dSceneObjects(sceneKey, scenesObject) {
    const sceneSettings = this.sceneObjects[sceneKey];
    if (sceneSettings.scene) {
      sceneSettings.scene.initObjects();
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
    if (this.currentSceneObject === Screen.TOP && this.currentSceneObject !== sceneObjectId) {
      this.cameraAnimation = {
        element: null,
        status: true,
        durations: [1000],
        finites: [true],
        delays: [0],
        animationFunctions: [
          (el, progress) => this.cameraAnimationMove(el, progress),
        ],
      };
    } else if (this.currentSceneObject !== Screen.TOP && sceneObjectId !== Screen.TOP && this.currentSceneObject !== sceneObjectId) {
      this.cameraAnimation = {
        element: null,
        status: true,
        durations: [1000],
        finites: [true],
        delays: [0],
        animationFunctions: [
          (el, progress) => this.cameraAnimationRotate(el, progress),
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

  setColor() {
    this.color = new THREE.Color(this.backgroundColor);
    this.renderer.setClearColor(this.color, this.alpha);
  }

  cameraAnimationMove(object, progress) {
    this.cameraRig.zShift = 4675 - 2415 * progress;
    this.cameraRig.angleY = THREE.Math.degToRad(-15 * progress);
    this.cameraRig.invalidate();
  }

  cameraAnimationRotate(object, progress) {
    const targetDegree = this.sceneObjects[this.currentSceneObject].cameraSettings.angleX;
    const currentDegree = this.sceneObjects[this.previousSceneObject].cameraSettings.angleX;
    const newDegree = currentDegree - targetDegree > 0 ? currentDegree - 90 * progress : currentDegree + 90 * progress;
    this.cameraRig.angleX = THREE.Math.degToRad(newDegree);
    this.cameraRig.invalidate();
  }

  setCameraPositionWithoutAnimation(sceneObjectId) {
    const sceneCameraSettings = this.sceneObjects[sceneObjectId].cameraSettings;
    this.cameraRig.zShift = sceneCameraSettings.z;
    this.cameraRig.angleY = THREE.Math.degToRad(sceneCameraSettings.angleY);
    this.cameraRig.angleX = THREE.Math.degToRad(sceneCameraSettings.angleX);
    this.cameraRig.invalidate();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setSizes() {
    super.setSizes();
    this.aspectRatio = this.canvasWidth / this.canvasHeight;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.render();
  }

  startAnimation() {
    const scene = this.sceneObjects[this.currentSceneObject].scene;
    const sceneElements = [
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
    this.elements = sceneElements;
    if (this.cameraAnimation) this.elements.push(this.cameraAnimation);
    super.startAnimation();
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
