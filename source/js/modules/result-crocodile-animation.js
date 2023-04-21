import ResultAnimation from "./result-animation";
import { easeInQuad, easeOutQuad, easeInOutQuad } from "../general/easing";

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
        id: `key`,
        imagePath: `./img/module-4/lose-images/key.png`,
        position: { x: 50, y: 50, width: 15 },
        transforms: {
          opacity: 0,
          scaleX: 0.7,
          scaleY: 0.7,
        },
        durations: [250],
        finites: [true],
        delays: [100],
        animationFunctions: [
          (element, progress) => this.keyAnimationFunc(element, progress),
        ],
      },
      {
        id: `crocodile`,
        drawElement: (element, animations) =>
          this.drawMask(element, animations),
        imagePath: `./img/module-4/lose-images/crocodile.png`,
        position: { x: 48, y: 61, width: 55 },
        transforms: {
          opacity: 0,
          translateX: 15,
          translateY: -10,
        },
        durations: [500],
        finites: [true],
        delays: [600],
        animationFunctions: [
          (element, progress) => this.crocodileAnimationFunc(element, progress),
        ],
      },
      {
        id: `drop`,
        imagePath: `./img/module-4/lose-images/drop.png`,
        position: { x: 47, y: 64.2, width: 3 },
        transforms: {
          opacity: 0,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [1400],
        finites: [false],
        delays: [1150],
        animationFunctions: [
          (element, progress) => this.dropAnimationFunc(element, progress),
        ],
      },
      {
        id: `flamingo`,
        imagePath: `./img/module-4/lose-images/flamingo.png`,
        position: { x: 30, y: 45, width: 15 },
        transforms: {
          opacity: 0,
          translateY: 20,
          translateX: 18,
          rotate: 40,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [500, 500, 400],
        finites: [true, true, true],
        delays: [300, 300, 1000],
        animationFunctions: [
          (element, progress) => this.thingAnimationFunc(element, progress),
          (element, progress) => this.flamingoAnimationFunc(element, progress),
          (element, progress) => this.thingFallAnimationFunc(element, progress),
        ],
      },
      {
        id: `watermelon`,
        imagePath: `./img/module-4/lose-images/watermelon.png`,
        position: { x: 15, y: 80, width: 12 },
        transforms: {
          opacity: 0,
          translateY: -10,
          translateX: 30,
          rotate: 30,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [500, 500, 400],
        finites: [true, true, true],
        delays: [300, 300, 1000],
        animationFunctions: [
          (element, progress) => this.thingAnimationFunc(element, progress),
          (element, progress) =>
            this.watermelonAnimationFunc(element, progress),
          (element, progress) => this.thingFallAnimationFunc(element, progress),
        ],
      },
      {
        id: `leaf`,
        imagePath: `./img/module-4/lose-images/leaf.png`,
        position: { x: 80, y: 40, width: 15 },
        transforms: {
          opacity: 0,
          translateY: 15,
          translateX: -18,
          rotate: -20,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [500, 500, 400],
        finites: [true, true, true],
        delays: [300, 300, 1000],
        animationFunctions: [
          (element, progress) => this.thingAnimationFunc(element, progress),
          (element, progress) => this.leafAnimationFunc(element, progress),
          (element, progress) => this.thingFallAnimationFunc(element, progress),
        ],
      },
      {
        id: `snowflake`,
        imagePath: `./img/module-4/lose-images/snowflake.png`,
        position: { x: 65, y: 55, width: 12 },
        transforms: {
          opacity: 0,
          translateY: 5,
          translateX: -8,
          rotate: -20,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [500, 500, 400],
        finites: [true, true, true],
        delays: [300, 300, 1000],
        animationFunctions: [
          (element, progress) => this.thingAnimationFunc(element, progress),
          (element, progress) => this.snowflakeAnimationFunc(element, progress),
          (element, progress) => this.thingFallAnimationFunc(element, progress),
        ],
      },
      {
        id: `saturn`,
        imagePath: `./img/module-4/lose-images/saturn.png`,
        position: { x: 85, y: 80, width: 15 },
        transforms: {
          opacity: 0,
          translateY: -4,
          translateX: -30,
          rotate: 30,
          scaleX: 0.1,
          scaleY: 0.1,
        },
        durations: [500, 500, 400],
        finites: [true, true, true],
        delays: [300, 300, 1000],
        animationFunctions: [
          (element, progress) => this.thingAnimationFunc(element, progress),
          (element, progress) =>
            this.saturnAnimationFunc(element, progress),
          (element, progress) => this.thingFallAnimationFunc(element, progress),
        ],
      },
    ];
  }

  drawMask(_element, _progress) {
    this.ctx.restore();
    this.ctx.save();
    this.ctx.beginPath();

    const radius = this.elements[0].position.curW / 2;
    const centerX = this.elements[0].position.curX + radius;
    const centerY = this.elements[0].position.curY + radius;

    this.ctx.arc(
        centerX,
        centerY,
        radius,
        1.6 * Math.PI,
        0.4 * Math.PI,
        false
    );
    this.ctx.moveTo(centerX + 0.4 * radius, centerY - radius + 0.1 * radius);
    this.ctx.lineTo(this.elements[0].position.curX + this.elements[0].position.curW,
        this.elements[0].position.curY + this.elements[0].position.curH);
    this.ctx.lineTo(this.elements[0].position.curX + this.elements[0].position.curW,
        this.canvasHeight);
    this.ctx.lineTo(0, this.canvasHeight);
    this.ctx.lineTo(0, this.elements[0].position.curY);

    this.ctx.clip();
  }

  keyAnimationFunc(element, progress) {
    element.transforms.opacity = easeInOutQuad(progress);
    element.transforms.scaleX = 0.7 + 0.3 * easeInOutQuad(progress);
    element.transforms.scaleY = 0.7 + 0.3 * easeInOutQuad(progress);
    element.transforms.translateY = element.transforms.scaleY;
    element.transforms.translateX = -element.transforms.scaleX;
    // TODO: скейлинг из центра
  }

  crocodileAnimationFunc(element, progress) {
    element.transforms.opacity = 1;
    element.transforms.translateX = 15 - 15 * progress;
    element.transforms.translateY = -10 + 10 * progress;
  }

  dropAnimationFunc(element, progress) {
    if (progress <= 0.4) {
      element.transforms.opacity = 1;
      element.transforms.scaleX = 0.6 + progress;
      element.transforms.scaleY = 0.6 + progress;
      element.transforms.translateY = element.transforms.scaleY;
      element.transforms.translateX = -element.transforms.scaleX;
    } else if (progress > 0.4 && progress < 0.6) {
      element.transforms.scaleX = 1;
      element.transforms.scaleY = 1;
      element.transforms.translateY += 1;
    } else if (progress >= 0.6 && progress < 0.7) {
      element.transforms.opacity = (1 - progress) / 0.6;
      element.transforms.scaleX = (1 - progress) / 0.6;
      element.transforms.scaleY = (1 - progress) / 0.6;
      element.transforms.translateY += element.transforms.scaleY + 0.1;
      element.transforms.translateX = -element.transforms.scaleX;
    } else {
      element.transforms.opacity = 0;
    }
  }

  thingAnimationFunc(element, progress) {
    element.transforms.opacity = 1;
    element.transforms.scaleX = easeOutQuad(progress);
    element.transforms.scaleY = easeOutQuad(progress);
  }

  flamingoAnimationFunc(element, progress) {
    element.transforms.translateY = 20 - 20 * easeOutQuad(progress);
    element.transforms.translateX = 18 - 18 * easeOutQuad(progress);
    element.transforms.rotate = 40 - 40 * easeOutQuad(progress);
  }

  watermelonAnimationFunc(element, progress) {
    element.transforms.translateY = -10 + 10 * easeOutQuad(progress);
    element.transforms.translateX = 30 - 30 * easeOutQuad(progress);
    element.transforms.rotate = 30 - 30 * easeOutQuad(progress);
  }

  leafAnimationFunc(element, progress) {
    element.transforms.translateY = 15 - 15 * easeOutQuad(progress);
    element.transforms.translateX = -18 + 18 * easeOutQuad(progress);
    element.transforms.rotate = -20 + 20 * easeOutQuad(progress);
  }

  snowflakeAnimationFunc(element, progress) {
    element.transforms.translateY = 5 - 5 * easeOutQuad(progress);
    element.transforms.translateX = -8 + 8 * easeOutQuad(progress);
    element.transforms.rotate = -20 + 20 * easeOutQuad(progress);
  }

  saturnAnimationFunc(element, progress) {
    element.transforms.translateY = -4 + 4 * easeOutQuad(progress);
    element.transforms.translateX = -30 + 30 * easeOutQuad(progress);
    element.transforms.rotate = 30 - 30 * easeOutQuad(progress);
  }

  thingFallAnimationFunc(element, progress) {
    element.transforms.translateY = 80 * easeInQuad(progress);
  }
}
