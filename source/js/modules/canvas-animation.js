import {AnimationType} from "../general/consts";

export default class CanvasAnimation {
  constructor(canvasElement, fps, type, withAlpha = false) {
    this.type = type;
    this.frameInterval = 1000 / fps;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext(
        this.type === AnimationType._2D ? `2d` : `3d`,
        {alpha: withAlpha}
    );
    this.canvasWidth = this.canvasHeight = null;
    this.elements = null;
    this.runnungAnimation = null;
    this.startTime = null;
    this.lastFrameTime = null;
    this.setSizes = this.setSizes.bind(this);
    window.addEventListener(`resize`, this.setSizes);
  }

  removeEventListeners() {
    window.removeEventListener(`resize`, this.setSizes);
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
      this.prepareAnimationTick(now, elapsed);
    }
  }

  prepareAnimationTick(now, elapsed) {
    this.lastFrameTime = now - (elapsed % this.frameInterval);
    this.clearScene();

    this.elements.forEach((el, elIndex) => {
      if (el.status) {
        let animations = [];
        el.animationFunctions.forEach((animation, index) => {
          const isAnimationDelayed = now < this.startTime + el.delays[index];
          const isAnimationFinished = el.finites[index]
            ? now > this.startTime + el.delays[index] + el.durations[index]
            : false;
          if (!isAnimationDelayed && !isAnimationFinished) {
            const pastProgress =
              (now - this.startTime - el.delays[index]) / el.durations[index];
            const progress = el.finites[index]
              ? pastProgress
              : pastProgress - Math.trunc(pastProgress);
            animations.push({animationFunction: animation, progress});
          }
          if (isAnimationFinished && !animation.hasEndPosition) {
            this.elements[elIndex].animationFunctions[index].hasEndPosition = true;
            animations.push({animationFunction: animation, progress: 1}); // чтобы анимация гарантировано закончилась конечными настройками
          }
        });
        this.runAnimationTick(el, animations);
      }
    });
  }

  runAnimationTick(el, animations) {
    this.setElement(el, animations);
  }

  stopAnimation() {
    if (this.runnungAnimation) {
      cancelAnimationFrame(this.runnungAnimation);
      this.runnungAnimation = this.startTime = this.lastFrameTime = null;
      this.clearScene();
    }
  }

  setContainerWidth() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  setSizes() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.setContainerWidth();
  }

  setElement(element, animations) {
    let [x, y, width, height] = this._getElementAbsolutePosition(element);
    animations.forEach((animation) =>
      animation.animationFunction(element, animation.progress)
    );

    const transforms = element.transforms;

    if (!transforms || transforms.opacity === 0) {
      return;
    }

    const isContextTransforming =
      transforms &&
      (transforms.opacity ||
        transforms.rotate ||
        transforms.scaleX ||
        transforms.scaleY);

    if (isContextTransforming) {
      this.ctx.save();
    }

    if (transforms) {
      if (transforms.opacity) {
        this.ctx.globalAlpha = transforms.opacity;
      }

      if (transforms.translateX) {
        x += this.canvasWidth * (transforms.translateX / 100);
      }

      if (transforms.translateY) {
        y += this.canvasHeight * (transforms.translateY / 100);
      }

      if (transforms.rotate) {
        this.ctx.translate(x + width / 2, y + height / 2);
        this.ctx.rotate((transforms.rotate * Math.PI) / 180);
        this.ctx.translate(-x - width / 2, -y - height / 2);
      }

      if (transforms.scaleX) {
        width *= transforms.scaleX;

        if (transforms.scaleX < 0) {
          this.ctx.scale(-1, 1);

          x = -x;
        }
      }

      if (transforms.scaleY) {
        height *= transforms.scaleY;

        if (transforms.scaleY < 0) {
          this.ctx.scale(1, -1);

          y = -y;
        }
      }
    }

    element.position.curX = x;
    element.position.curY = y;
    element.position.curH = height;
    element.position.curW = width;

    if (typeof element.drawElement === `function`) {
      element.drawElement(element);
    }
    this.ctx.drawImage(element.image, x, y, width, height);

    if (isContextTransforming) {
      this.ctx.restore();
    }
  }

  getHeightByWidth(realWidth, realHeight, renderWidth) {
    const ratio = realWidth / realHeight;
    return renderWidth / ratio;
  }

  getScaledTranslate(scale, valueBeforeScale) {
    const scaled = scale * valueBeforeScale - valueBeforeScale;
    return -scaled / 2;
  }

  _getElementAbsolutePosition(element) {
    const elementPosition = element.position;
    const width = this.canvasWidth * (elementPosition.width / 100);
    const x = this.canvasWidth * (elementPosition.x / 100) - width / 2;
    const height = this.getHeightByWidth(element.image.width, element.image.height, width);
    const y = this.canvasHeight * (elementPosition.y / 100) - height / 2;
    return [x, y, width, height];
  }

  clearScene() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  rotateElement(element, direction = 1) {
    this.ctx.translate(
        element.position.curX + element.position.curW / 2,
        element.position.curY + element.position.curH / 2
    );
    this.ctx.rotate((direction * (element.transforms.rotate * Math.PI)) / 180);
    this.ctx.translate(
        -element.position.curX - element.position.curW / 2,
        -element.position.curY - element.position.curH / 2
    );
  }
}
