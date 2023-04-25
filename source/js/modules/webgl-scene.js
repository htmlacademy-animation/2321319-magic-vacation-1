import * as THREE from "three";
import CustomMaterial from './3d/custom-material';

export default class WebGLScene {
  constructor(canvasElement, sceneObjects) {
    this.canvas = canvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.aspectRatio = this.canvas.width / this.canvas.height;
    this.sceneObjects = sceneObjects;
    this.alpha = 1;
    this.backgroundColor = `#5f458c`;
    this.near = 0.1;
    this.far = 1000;
    this.fov = (180 * (2 * Math.atan(this.canvas.height / 2 / this.far))) / Math.PI;
    this.cameraPosition = {
      x: 0,
      y: 0,
      z: 1000
    };
    this.isLoading = true;
    this.currentSceneObject = null;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });

    this.camera = new THREE.PerspectiveCamera(
        this.fov,
        this.aspectRatio,
        this.near,
        this.far
    );
    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);

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
    Promise.allSettled(fetches)
      .then((results) => {
        results.forEach((result, i) => {
          if (result.status === `fulfilled`) {
            const objectSettings = Object.values(this.sceneObjects);
            const material = new CustomMaterial(result.value, THREE.Math.degToRad(objectSettings[i].hue));
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
    this.backgroundColor = getComputedStyle(document.body).getPropertyValue(`--secondary-color`).trim();
    this.setColor();
    this.camera.position.set(objectPosition.x, objectPosition.y, this.cameraPosition.z);
    this.render();
  }

  setColor() {
    this.color = new THREE.Color(this.backgroundColor);
    this.renderer.setClearColor(this.color, this.alpha);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
