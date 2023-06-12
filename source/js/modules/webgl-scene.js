import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CustomMaterial from "./3d/materials/custom-material";
import { Screen, ThemeColor } from "../general/consts";
import ObjectLoader from "./3d/objects/object-loader";
import PyramidScene from "./3d/scenes/story-pyramid-scene";
import SnowmanScene from "./3d/scenes/story-snowman-scene";
import IntroScene from "./3d/scenes/intro-scene";
import DogScene from "./3d/scenes/story-dog-scene";
import IIScene from "./3d/scenes/story-ii-scene";

export default class WebGLScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.aspectRatio = this.canvas.width / this.canvas.height;
    this.storyScenes = null;
    this.sceneObjects = {};
    this.alpha = 1;
    this.backgroundColor = `#5f458c`;
    this.near = 0.1;
    this.far = 6000;
    this.fov = 35;
    // this.fov =
    //   (180 * (2 * Math.atan(this.canvas.height / 2 / this.far))) / Math.PI;
    this.cameraPosition = {
      x: 0,
      y: 0,
      z: 2550,
    };
    this.isLoading = true;
    this.currentSceneObject = null;

    this.frameInterval = 1000 / 50;
    this.runnungAnimation = null;
    this.startTime = null;
    this.lastFrameTime = null;

    window.addEventListener(`resize`, () => this.setSizes());
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });

    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far
    );

    this.camera.position.set(
      this.cameraPosition.x,
      this.cameraPosition.y,
      this.cameraPosition.z
    );
    this.camera.rotation.set(0, THREE.Math.degToRad(-15), 0);

    // TODO: убрать после завершения работы
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.addEventListener(`change`, () => {
      this.renderer.render(this.scene, this.camera);
    });
    this.controls.update();

    this.setColor();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);


    if (window.innerWidth > 991) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.initLight();
    this.initObjects();
  }

  initLight() {
    const light = new THREE.Group();

    const lightDirection = new THREE.DirectionalLight(0xffffff, 0.84);
    lightDirection.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    const targetForLight = new THREE.Object3D();
    const targetY =
      this.camera.position.z * Math.tan(THREE.Math.degToRad(15.0)); // прилежащий катет на тангенс
    targetForLight.position.set(
      this.camera.position.x,
      targetY,
      this.camera.position.z
    );
    this.scene.add(targetForLight);
    lightDirection.target = targetForLight;
    light.add(lightDirection);

    const lightPoint1 = new THREE.PointLight(0xf6f2ff, 0.6, 2500, 2);
    lightPoint1.position.set(-785, -350, -710);
    lightPoint1.castShadow = true;
    lightPoint1.shadow.mapSize.width = 1024;
    lightPoint1.shadow.mapSize.height = 1024;
    lightPoint1.shadow.camera.near = 0.5;
    lightPoint1.shadow.camera.far = 6000;
    lightPoint1.shadow.camera.visible = true;

    light.add(lightPoint1);

    const lightPoint2 = new THREE.PointLight(0xf5feff, 0.95, 2500, 2);
    lightPoint2.position.set(730, 800, -985);
    lightPoint2.castShadow = true;
    lightPoint2.shadow.mapSize.width = 1024;
    lightPoint2.shadow.mapSize.height = 1024;
    lightPoint2.shadow.camera.near = 0.5;
    lightPoint2.shadow.camera.far = 6000;
    lightPoint2.shadow.camera.visible = true;

    light.add(lightPoint2);

    // TODO: удалить после окончательной постановки света
    const lightForTesting = new THREE.AmbientLight(`0xFFFF`, 0.2);
    light.add(lightForTesting);

    light.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    this.scene.add(light);
  }

  async initObjects() {
    this.objectLoader = new ObjectLoader();
    await this.objectLoader.initObjects();
    this.initScenesSettings();
    Object.entries(this.sceneObjects).map(([key, _value]) => {
      // this.initImage(this.objectLoader.getObjectByName(key).object, key);
      this.init3dSceneObjects(key);
    });
    this.isLoading = false;
    if (this.currentSceneObject !== null) {
      this.renderSceneObject(this.currentSceneObject);
    }
  }

  initScenesSettings() {
    const imageWidth = 2048;
    const imageHeight = 1024;
    const scenes = {
      [Screen.TOP]: new IntroScene(this.objectLoader),
      [ThemeColor.LIGHT_PURPLE]: new DogScene(this.objectLoader),
      [ThemeColor.BLUE]: new PyramidScene(this.objectLoader),
      [ThemeColor.LIGHT_BLUE]: new SnowmanScene(this.objectLoader),
      [ThemeColor.PURPLE]: new IIScene(this.objectLoader),
    };

    this.sceneObjects[Screen.TOP] = {
      position: {
        x: 0,
        y: 0,
        z: 0,
        width: imageWidth,
        height: imageHeight,
      },
      scene: scenes[Screen.TOP],
      hue: 0.0,
      bubbles: [],
      durations: [],
      finites: [],
      delays: [],
      animationFunctions: [],
    };
    Object.entries(ThemeColor).forEach(([_key, value], index) => {
      this.sceneObjects[value] = {
        position: {
          // x: imageWidth * (index + 1),
          x: 0,
          y: 0,
          z: 0,
          width: imageWidth,
          height: imageHeight,
        },
        scene: scenes[value] ? scenes[value] : null,
        hue: 0.0,
        ...this.getSceneObjectsSettings(index),
      };
    });
  }

  initImage(imageValue, sceneKey) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const material = new CustomMaterial(
      new THREE.Vector2(this.canvas.width, this.canvas.height),
      imageValue,
      THREE.Math.degToRad(this.sceneObjects[sceneKey].hue),
      !!this.sceneObjects[sceneKey].bubbles.length,
      this.sceneObjects[sceneKey].bubbles.map((el) => ({
        center: new THREE.Vector2(el.center.x, el.center.y),
        radius: el.radius,
      }))
    );
    material.needsUpdate = true;
    this.sceneObjects[sceneKey].material = material;
    const image = new THREE.Mesh(planeGeometry, material);
    const imagePosition = this.sceneObjects[sceneKey].position;
    image.position.set(imagePosition.x, imagePosition.y, imagePosition.z);
    image.scale.set(imagePosition.width, imagePosition.height, 1);
    this.scene.add(image);
  }

  init3dSceneObjects(sceneKey) {
    const sceneSettings = this.sceneObjects[sceneKey];
    if (sceneSettings.scene) {
      sceneSettings.scene.initObjects();
      sceneSettings.scene.addToScene(this.scene);
    }
  }

  getSceneObjectsSettings(index) {
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
          durations: [],
          finites: [],
          delays: [],
          animationFunctions: [],
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
    this.currentSceneObject = sceneObjectId;
    if (this.isLoading) {
      return;
    }
    const objectPosition = this.sceneObjects[sceneObjectId].position;
    this.backgroundColor =
      getComputedStyle(document.body)
        .getPropertyValue(`--secondary-color`)
        .trim() || this.backgroundColor;
    this.setColor();
    this.camera.position.set(
      objectPosition.x,
      objectPosition.y,
      this.cameraPosition.z
    );
    this.controls.target = new THREE.Vector3(
      objectPosition.x,
      objectPosition.y,
      0
    );
    this.render();
    this.startAnimation();
  }

  setColor() {
    this.color = new THREE.Color(this.backgroundColor);
    this.renderer.setClearColor(this.color, this.alpha);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setSizes() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.aspectRatio = this.canvas.width / this.canvas.height;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.render();
  }

  startAnimation() {
    if (!this.canvas) {
      return;
    }

    this.stopAnimation();
    this.startTime = Date.now();
    this.lastFrameTime = this.startTime;
    this.tick();
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    this.runnungAnimation = requestAnimationFrame(() => this.tick());

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      const currentSceneObject = this.sceneObjects[this.currentSceneObject];
      currentSceneObject.animationFunctions.forEach(
        (animationFunction, index) => {
          const isAnimationDelayed =
            now < this.startTime + currentSceneObject.delays[index];
          const isAnimationFinished = currentSceneObject.finites[index]
            ? now >
              this.startTime +
                currentSceneObject.delays[index] +
                currentSceneObject.durations[index]
            : false;
          if (!isAnimationDelayed && !isAnimationFinished) {
            const pastProgress =
              (now - this.startTime - currentSceneObject.delays[index]) /
              currentSceneObject.durations[index];
            const progress = currentSceneObject.finites[index]
              ? pastProgress
              : pastProgress - Math.trunc(pastProgress);
            animationFunction(progress);
            this.render();
          }
        }
      );
    }
  }

  stopAnimation() {
    if (this.runnungAnimation) {
      cancelAnimationFrame(this.runnungAnimation);
      this.runnungAnimation = this.startTime = this.lastFrameTime = null;
      if (this.sceneObjects[this.currentSceneObject].bubbles.length) {
        this.sceneObjects[this.currentSceneObject].bubbles =
          this.getInitialBubblesPosition();
        this.sceneObjects[this.currentSceneObject].bubbles.forEach(
          (el, index) => {
            this.sceneObjects[
              this.currentSceneObject
            ].material.uniforms.bubbles.value[index] = {
              center: new THREE.Vector2(el.center.x, el.center.y),
              radius: el.radius,
            };
          }
        );
        this.sceneObjects[
          this.currentSceneObject
        ].material.uniforms.hue.value = 0.0;
        this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
      }
    }
  }

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
