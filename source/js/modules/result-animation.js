import CanvasAnimation from "./canvas-animation";
import {AnimationType} from "../general/consts";

export default class ResultAnimation extends CanvasAnimation {
  constructor(canvasElement, fps, withAlpha = false) {
    super(canvasElement, fps, AnimationType._2D, withAlpha);
  }

  startAnimation() {
    if (!this.canvas) {
      return;
    }

    this.stopAnimation();
    this.drawElements();
  }

  drawElements() {
    if (!this.elements) {
      return;
    }
    const fetches = this.elements.map((el) => this.loadImage(el));
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


  setContainerWidth() {
    super.setContainerWidth();
    this.canvas.top = 0;
  }
}
