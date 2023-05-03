import * as THREE from "three";
import CustomMaterial from "./3d/custom-material";
import {Screen} from "../general/consts";

export default class WebGLScene {
  constructor(canvasElement, storySettings) {
    this.canvas = canvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.aspectRatio = this.canvas.width / this.canvas.height;
    this.sceneObjects = {};
    this.initSceneObjects(storySettings);
    this.alpha = 1;
    this.backgroundColor = `#5f458c`;
    this.near = 0.1;
    this.far = 1000;
    this.fov =
      (180 * (2 * Math.atan(this.canvas.height / 2 / this.far))) / Math.PI;
    this.cameraPosition = {
      x: 0,
      y: 0,
      z: 1000,
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

  initSceneObjects(storySettings) {
    const imageWidth = 2048;
    const imageHeight = 1024;
    this.sceneObjects[Screen.TOP] = {
      url: `./img/module-5/scenes-textures/scene-0.png`,
      position: {
        x: 0,
        y: 0,
        z: 0,
        width: imageWidth,
        height: imageHeight
      },
      hue: 0.0,
      bubbles: [],
      durations: [],
      finites: [],
      delays: [],
      animationFunctions: []
    };
    Object.entries(storySettings).forEach(([key, value], index) => {
      this.sceneObjects[key] = {
        url: value.backgroundImage,
        position: {
          x: imageWidth * (index + 1),
          y: 0,
          z: 0,
          width: imageWidth,
          height: imageHeight
        },
        hue: index === 1 ? -12.0 : 0.0,
        // нормализованные координаты
        bubbles: index === 1
          ? [
            {
              center: { x: 0.45, y: 0.75 },
              radius: 0.08,
            },
            {
              center: { x: 0.3, y: 0.6 },
              radius: 0.06,
            },
            {
              center: { x: 0.49, y: 0.4 },
              radius: 0.03,
            }
          ]
          : [],
        durations: [1800, 600],
        finites: [false, true],
        delays: [0, 200],
        animationFunctions: index === 1
          ? [
            (progress) => this.hueBlinkAnimationFunct(progress),
            (progress) => this.bubblesMoveAnimationFunct(progress)
          ]
          : [],
      };
    });
  }

  init() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
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

    this.setColor();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    this.initObjects();
  }

  initObjects() {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const fetches = Object.values(this.sceneObjects).map((texture) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(texture.url, resolve, reject);
      });
    });
    Promise.allSettled(fetches).then((results) => {
      results.forEach((result, i) => {
        if (result.status === `fulfilled`) {
          const objectSettings = Object.values(this.sceneObjects);
          const key = Object.keys(this.sceneObjects)[i];
          const material = new CustomMaterial(
            new THREE.Vector2(this.canvas.width, this.canvas.height),
            result.value,
            THREE.Math.degToRad(objectSettings[i].hue),
            !!objectSettings[i].bubbles.length,
            objectSettings[i].bubbles.map((el) => ({
              center: new THREE.Vector2(el.center.x, el.center.y),
              radius: el.radius,
            }))
          );
          material.needsUpdate = true;
          this.sceneObjects[key].material = material;
          const image = new THREE.Mesh(planeGeometry, material);
          const imagePosition = objectSettings[i].position;
          image.position.set(imagePosition.x, imagePosition.y, imagePosition.z);
          image.scale.set(imagePosition.width, imagePosition.height, 1);
          this.scene.add(image);
        }
      });
      this.isLoading = false;
      if (this.currentSceneObject !== null) {
        this.renderSceneObject(this.currentSceneObject);
      }
    });
  }

  renderSceneObject(sceneObjectId) {
    this.currentSceneObject = sceneObjectId;
    if (this.isLoading) {
      return;
    }
    const objectPosition = this.sceneObjects[sceneObjectId].position;
    this.backgroundColor = getComputedStyle(document.body)
      .getPropertyValue(`--secondary-color`)
      .trim();
    this.setColor();
    this.camera.position.set(
      objectPosition.x,
      objectPosition.y,
      this.cameraPosition.z
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
    this.tick();
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    this.runnungAnimation = requestAnimationFrame(() => this.tick());

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      const currentSceneObject = this.sceneObjects[this.currentSceneObject];
      currentSceneObject.animationFunctions.forEach((animationFunction, index) => {
        const isAnimationDelayed = now < this.startTime + currentSceneObject.delays[index];
        const isAnimationFinished = currentSceneObject.finites[index]
          ? now > this.startTime + currentSceneObject.delays[index] + currentSceneObject.durations[index]
          : false;
        if (!isAnimationDelayed && !isAnimationFinished) {
          const pastProgress = (now - this.startTime - currentSceneObject.delays[index]) / currentSceneObject.durations[index];
          const progress = currentSceneObject.finites[index] ? pastProgress : pastProgress - Math.trunc(pastProgress);
          animationFunction(progress);
          this.render();
        }
      });
    }
  }

  stopAnimation() {
    if (this.runnungAnimation) {
      cancelAnimationFrame(this.runnungAnimation);
      this.runnungAnimation = this.startTime = this.lastFrameTime = null;
    }
  }

  hueBlinkAnimationFunct(progress) {
    const hueForProgress = 6 * Math.sin(6.3 * progress + 1.6) - 6 + Math.random();
    const hueRad = THREE.Math.degToRad(hueForProgress);
    this.sceneObjects[this.currentSceneObject].material.uniforms.hue.value = hueRad;
    this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
  }

  bubblesMoveAnimationFunct(progress) {

  }
}
