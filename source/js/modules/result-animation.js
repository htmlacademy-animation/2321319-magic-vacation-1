export default class ResultAnimation {
  constructor(canvasElement, fps) {
    this.frameInterval = 1000 / fps;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext(`2d`);
    this.canvasWidth = this.canvasHeight = null;
    this.elements = null;
    this.runnungAnimation = null;
    this.startTime = null;
    this.lastFrameTime = null;
  }

  drawElements() {
    if (!this.elements) {
      return;
    }
    const fetches = this.elements
      .map((el) => this.loadImage(el));
    Promise.allSettled(fetches)
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === `fulfilled`) {
            this.elements[index].status = true;
          } else if (result.status === `rejected`) {
            this.elements[index].status = false;
          }
          this.startTime = Date.now();
          this.lastFrameTime = this.startTime;
          this.tick();
        });
      })
      .finally(() => {});
  }

  async loadImage(element) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = element.imagePath;
      element.image = image;
      image.addEventListener(`load`, () => resolve());
      image.addEventListener(`error`, () => reject());
    });
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

    this.ctx.drawImage(element.image, x, y, width, height);
    if (typeof element.drawElement === `function`) {
      element.drawElement(element);
    }

    if (isContextTransforming) {
      this.ctx.restore();
    }
  }

  _getElementAbsolutePosition(element) {
    const elementPosition = element.position;
    const width = this.canvasWidth * (elementPosition.width / 100);
    const ratio = element.image.width / element.image.height;
    const x = this.canvasWidth * (elementPosition.x / 100) - width / 2;
    const height = width / ratio;
    const y = this.canvasHeight * (elementPosition.y / 100) - height / 2;
    return [x, y, width, height];
  }

  setContainerWidth() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.top = 0;
  }

  startAnimation() {
    if (!this.canvas) {
      return;
    }

    this.stopAnimation();
    this.drawElements();
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    this.runnungAnimation = requestAnimationFrame(() => this.tick());

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      this.clearScene();
      this.elements.forEach((el) => {
        if (el.status) {
          let animations = [];
          el.animationFunctions.forEach((animation, index) => {
            const isAnimationDelayed = now < this.startTime + el.delays[index];
            const isAnimationFinished = el.finites[index]
              ? now > this.startTime + el.delays[index] + el.durations[index]
              : false;
            if (!isAnimationDelayed && !isAnimationFinished) {
              const pastProgress = (now - this.startTime - el.delays[index]) / el.durations[index];
              const progress = el.finites[index] ? pastProgress : pastProgress - Math.round(pastProgress);
              animations.push({animationFunction: animation, progress});
            }
          });
          this.setElement(el, animations);
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

  clearScene() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  rotateElement(element, direction = 1) {
    this.ctx.translate(element.position.curX + element.position.curW / 2, element.position.curY + element.position.curH / 2);
    this.ctx.rotate(direction * (element.transforms.rotate * Math.PI) / 180);
    this.ctx.translate(-element.position.curX - element.position.curW / 2, -element.position.curY - element.position.curH / 2);
  }
}
