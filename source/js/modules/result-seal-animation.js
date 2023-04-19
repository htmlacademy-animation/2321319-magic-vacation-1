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
    this.canvasHeight =
      window.innerHeight > imageWrapper.clientWidth
        ? imageWrapper.clientWidth
        : window.innerHeight;
    super.setContainerWidth();
  }

  _initElements() {
    this.elements = [
      {
        id: `treeLeft`,
        imagePath: `./img/module-4/win-primary-images/tree-2.png`,
        position: { x: 55, y: 62, width: 3 },
        transforms: {
          opacity: 0,
          translateY: 5,
        },
        durations: [400],
        finites: [true],
        delays: [400],
        animationFunctions: [
          (element, progress) => this.treeAnimationFunc(element, progress)
        ]
      },
      {
        id: `treeRight`,
        imagePath: `./img/module-4/win-primary-images/tree.png`,
        position: { x: 58, y: 64, width: 3 },
        transforms: {
          opacity: 0,
          translateY: 5,
        },
        durations: [400],
        finites: [true],
        delays: [400],
        animationFunctions: [
          (element, progress) => this.treeAnimationFunc(element, progress)
        ]
      },
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
        durations: [400, 2400],
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
        durations: [400, 2400],
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
        drawElement: (element, animations) =>
          this.drawTrack(element, animations),
        position: {
          x: 50,
          y: 60,
          width: 6,
          centerX: 45,
          centerY: 57,
          radius: 12,
        },
        transforms: {
          opacity: 0,
          rotate: 0,
        },
        durations: [600, 600],
        finites: [true, true],
        delays: [200, 200],
        animationFunctions: [
          (element, progress) => this.airplaneAnimationFunc(element, progress),
          (element, progress) => this.trackAnimationFunc(element, progress),
        ],
      },
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
    element.transforms.translateY = 5 * Math.sin(easeInOutQuad(progress) * 3.145);
    element.transforms.opacity = 1;
  }

  airplaneAnimationFunc(element, progress) {
    element.transforms.opacity = progress;
    element.transforms.translateX = 25 * easeInOutQuad(progress);
    element.transforms.translateY = -(
      50 * Math.sin(0.9 * easeInOutQuad(progress) + 4.1) +
      50
    );
    element.transforms.rotate =
      -50 * Math.cos(0.9 * easeInOutQuad(progress) + 4.1) + 45;
  }

  treeAnimationFunc(element, progress) {
    element.transforms.opacity = progress;
    element.transforms.translateY = 5 - 5 * progress;
  }

  drawTrack(element) {
    // TODO: изменить форму кривой
    this.ctx.save();
    this.ctx.globalCompositeOperation = `destination-over`;
    const centerX = element.position.centerX;
    const centerY = element.position.centerY;
    const radius = element.position.radius;

    this.ctx.fillStyle = `#acc3ff`;

    this.ctx.beginPath();
    this.rotateElement(element, -1);
    this.ctx.arc(
        (this.canvasWidth * centerX) / 100,
        (this.canvasHeight * centerY) / 100,
        (this.canvasWidth * radius) / 100,
        Math.PI / 2,
        (3 * Math.PI) / 2,
        false
    );
    this.ctx.moveTo(
        (this.canvasWidth * centerX) / 100,
        (this.canvasHeight * centerY) / 100 - (this.canvasWidth * radius) / 100
    );
    this.rotateElement(element);
    this.ctx.quadraticCurveTo(
        (this.canvasWidth * centerX) / 100 + (this.canvasWidth * radius) / 100,
        (this.canvasHeight * centerY) / 100,
        this.elements[6].position.curX,
        this.elements[6].position.curY + this.elements[6].position.curH - 10
    );
    this.rotateElement(element, -1);
    this.ctx.quadraticCurveTo(
        this.elements[6].position.curX,
        (this.canvasHeight * centerY) / 100 + (this.canvasWidth * radius) / 100 / 4,
        (this.canvasWidth * centerX) / 100,
        (this.canvasHeight * centerY) / 100 + (this.canvasWidth * radius) / 100
    );
    this.ctx.lineTo(
        (this.canvasWidth * centerX) / 100,
        (this.canvasHeight * centerY) / 100 - (this.canvasWidth * radius) / 100
    );
    this.ctx.fill();

    this.ctx.restore();
  }

  trackAnimationFunc(element, progress) {
    const progressReversed = 1 - progress;
    element.position.radius = 10 * progress;
    element.position.centerY = 57 - 10 * progressReversed;
    element.position.opacity = progress;
  }
}
