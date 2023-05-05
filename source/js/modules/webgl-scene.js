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
        hue: 0.0,
        ...this.getSceneObjectsSettings(index)
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

  getSceneObjectsSettings(index) {
    return index === 1 ? {
      bubbles: this.getInitialBubblesPosition(),
      durations: [2000, 2500, 2700, 2800],
      finites: [false, true, true, true],
      delays: [0, 200, 700, 900],
      animationFunctions: [
        (progress) => this.hueBlinkAnimationFunc(progress),
        (progress) => this.firstBubbleMoveAnimationFunc(progress),
        (progress) => this.secondBubbleMoveAnimationFunc(progress),
        (progress) => this.thirdBubbleMoveAnimationFunc(progress)
      ]
    }
    : {
      bubbles: [],
      durations: [],
      finites: [],
      delays: [],
      animationFunctions: []
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
      }
    ];
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
      if (this.sceneObjects[this.currentSceneObject].bubbles.length) {
        this.sceneObjects[this.currentSceneObject].bubbles = this.getInitialBubblesPosition();
        this.sceneObjects[this.currentSceneObject].bubbles.forEach((el, index) => {
          this.sceneObjects[this.currentSceneObject].material.uniforms.bubbles.value[index] = {
            center: new THREE.Vector2(el.center.x, el.center.y),
            radius: el.radius
          };
        });
        this.sceneObjects[this.currentSceneObject].material.uniforms.hue.value = 0.0;
        this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
      }
    }
  }

  hueBlinkAnimationFunc(progress) {
    const hueForProgress = 6 * Math.sin(6.3 * progress + 1.6) - 6 + Math.random();
    const hueRad = THREE.Math.degToRad(hueForProgress);
    this.sceneObjects[this.currentSceneObject].material.uniforms.hue.value = hueRad;
    this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
  }

  firstBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(progress, 2 * this.sceneObjects[this.currentSceneObject].bubbles[0].radius);
    const newX = 0.035 * Math.sin(15 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(0, newX, newY);
  }

  secondBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(progress, 2 * this.sceneObjects[this.currentSceneObject].bubbles[1].radius);
    const newX = 0.025 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(1, newX, newY);
  }

  thirdBubbleMoveAnimationFunc(progress) {
    const newY = this.getProgressedValue(progress, 2 * this.sceneObjects[this.currentSceneObject].bubbles[2].radius);
    const newX = 0.02 * Math.sin(18 * progress + 1.5) * Math.exp(-0.8 * progress);
    this.bubbleMoveAnimation(2, newX, newY);
  }

  getProgressedValue(progress, diameter) {
    return progress + diameter + diameter * progress;
  }

  bubbleMoveAnimation(index, curX, curY) {
    let [x, y] = [
      this.sceneObjects[this.currentSceneObject].bubbles[index].center.x,
      this.sceneObjects[this.currentSceneObject].bubbles[index].center.y
    ];
    y += curY;
    x += curX;

    this.sceneObjects[this.currentSceneObject].material.uniforms.bubbles.value[index].center = new THREE.Vector2(x, y);
    this.sceneObjects[this.currentSceneObject].material.needsUpdate = true;
  }
}
