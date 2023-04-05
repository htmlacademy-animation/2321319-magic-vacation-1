import ResultAnimation from "./result-animation";
import { easeOutElastic, easeInOutQuad } from "../general/easing";

export default class ResultSealAnimation extends ResultAnimation {
  constructor(canvasElement) {
    super(canvasElement, 50);
    this._initElements();
  }

  setContainerWidth() {
    const imageWrapper = document.querySelector(`.screen--show .result__image`);
    this.canvasWidth = imageWrapper.clientWidth;
    this.canvasHeight = window.innerHeight;
    super.setContainerWidth();
  }

  _initElements() {
    this.elements = [
      {
        id: `ice`,
        imagePath: `./img/module-4/win-primary-images/ice.png`,
        position: { x: 50, y: 72, width: 30 },
        transforms: {
          rotate: 10,
          translateY: 82,
        },
        durations: [200, 1800],
        finites: [true, true],
        delays: [0, 240],
        animationFunctions: [
          (element, progress) =>
            this.iceAppearanceAnimationFunc(element, progress),
          (element, progress) => this.iceAnimationFunc(element, progress),
        ],
      },
      {
        id: `seal`,
        imagePath: `./img/module-4/win-primary-images/sea-calf-2.png`,
        position: { x: 48, y: 63, width: 32 },
        transforms: {
          rotate: 10,
          translateY: 73,
        },
        durations: [200, 1800],
        finites: [true, true],
        delays: [0, 240],
        animationFunctions: [
          (element, progress) =>
            this.iceAppearanceAnimationFunc(element, progress),
          (element, progress) => this.iceAnimationFunc(element, progress),
        ],
      },
      {
        id: `snowflakeLeft`,
        imagePath: `./img/module-4/win-primary-images/snowflake.png`,
        position: { x: 33, y: 57, width: 15 },
        transforms: {
          opacity: 0,
          translateY: 0,
        },
        durations: [400, 2100],
        finites: [true, false],
        delays: [200, 400],
        animationFunctions: [
          (element, progress) =>
            this.snowAppearanceAnimationFunc(element, progress),
          (element, progress) => this.snowAnimationFunc(element, progress),
        ],
      },
      {
        id: `snowflakeRight`,
        imagePath: `./img/module-4/win-primary-images/snowflake.png`,
        position: { x: 63, y: 65, width: 12 },
        transforms: {
          scaleY: -1,
          scaleX: -1,
          opacity: 0,
        },
        durations: [400, 2100],
        finites: [true, false],
        delays: [400, 600],
        animationFunctions: [
          (element, progress) =>
            this.snowAppearanceAnimationFunc(element, progress),
          (element, progress) => this.snowAnimationFunc(element, progress),
        ],
      },
      {
        id: `airplane`,
        imagePath: `./img/module-4/win-primary-images/airplane.png`,
        position: { x: 50, y: 55, width: 11 },
        transforms: {
          opacity: 0,
        },
        durations: [600],
        finites: [true],
        delays: [200],
        animationFunctions: [
          (element, progress) => this.airplaneAnimationFunc(element, progress),
        ],
      },
      {
        id: `back`,
        isFigure: true,
        drawElement: (element, animations) => this.drawBack(element, animations),
        transforms: {
          centerX: 45,
          centerY: 55,
          radius: 15
        },
        durations: [600],
        finites: [true],
        delays: [200],
        animationFunctions: [
          (element, progress) => this.backAnimationFunc(element, progress),
        ],
      },
      //   {
      //     id: `treeLeft`,
      //     imagePath: `./img/module-4/win-primary-images/tree.png`,
      //     position: {x: 10, y: 10, width: 100},
      //     transforms: {},
      //     animationFunction: () => {}
      //   },
      //   {
      //     id: `treeRight`,
      //     imagePath: `./img/module-4/win-primary-images/tree-2.png`,
      //     position: {x: 10, y: 10, width: 100},
      //     transforms: {},
      //     animationFunction: () => {}
      //   },
    ];
  }

  iceAppearanceAnimationFunc(element, progress) {
    element.transforms.translateY -= element.transforms.translateY * progress;
  }

  iceAnimationFunc(element, progress) {
    const elProgress = easeOutElastic(progress);
    element.transforms.translateY = -10 + 10 * elProgress;
    element.transforms.rotate = 10 * Math.sin(elProgress * 1.5 + 20.4);
  }

  snowAppearanceAnimationFunc(element, progress) {
    element.transforms.opacity = progress;
  }

  snowAnimationFunc(element, progress) {
    element.transforms.translateY = 5 * Math.sin(easeInOutQuad(progress) * 3);
  }

  airplaneAnimationFunc(element, progress) {
    element.transforms.opacity = progress;
    element.transforms.translateX = 35 * easeInOutQuad(progress);
    element.transforms.translateY = -(100 * Math.sin(0.9 * easeInOutQuad(progress) + 4.1) + 100);
    element.transforms.rotate = -90 * Math.cos(0.9 * easeInOutQuad(progress) + 4.1) + 45;
  }

  drawBack(element, animations) {
  }

  backAnimationFunc(element, progress) {

  }
}
