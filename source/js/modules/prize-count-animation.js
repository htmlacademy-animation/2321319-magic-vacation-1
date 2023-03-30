export default class PrizeCountAnimation {
  constructor(minValue, maxValue, duration, fps, prizeElement) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.duration = duration;
    this.frameInterval = 1000 / fps;
    this.prizeElement = prizeElement;
    this.runnungAnimation = null;
    this.endTime = null;
    this.lastFrameTime = null;
    this.isFirstDrawing = true;
    this.currentValue = minValue;
  }

  startAnimation() {
    if (!this.prizeElement) {
      return;
    }

    if (this.isFirstDrawing) {
      this.setElementStyles();
      this.setCountOfPrize(this.minValue);
    }

    const startTime = Date.now();
    this.endTime = startTime + this.duration;
    this.lastFrameTime = startTime;
    this.isFirstDrawing = false;
    this.tick();
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    if (now >= this.endTime) {
      this.stopAnimation();
      return;
    }

    this.runnungAnimation = requestAnimationFrame(() => this.tick());

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      const restProgress = (this.endTime - now) / this.duration;
      this.minValue = this.maxValue - (this.maxValue - this.minValue) * restProgress;
      const maxHalfValue = this.minValue + (this.maxValue - this.minValue) / 2;
      const newValue = Math.round(Math.random() * (maxHalfValue - this.minValue) + this.minValue);
      this.setCountOfPrize(newValue);
    }
  }

  stopAnimation() {
    if (this.runnungAnimation) {
      cancelAnimationFrame(this.runnungAnimation);
      this.runnungAnimation = this.endTime = this.lastFrameTime = null;
      this.setCountOfPrize(this.maxValue);
    }
  }

  setCountOfPrize(value) {
    if (value === this.currentValue) {
      return;
    }
    this.currentValue = value;
    this.prizeElement.children[0].textContent = value;
  }

  setElementStyles() {
    this.prizeElement.children[0].style.minWidth = `calc(${this.prizeElement.children[0].clientWidth}px + 1.2rem)`;
    this.prizeElement.style.opacity = 1;
    this.prizeElement.children[1].style.opacity = 1;
    this.prizeElement.children[1].style.transform = `translateX(0)`;
    this.prizeElement.parentElement.style.transform = `translateX(0)`;
  }

  setContainerWidth() {
    if (!this.isFirstDrawing) {
      return;
    }
    this.prizeElement.style.minWidth = `calc(${this.prizeElement.clientWidth}px + 1.2rem)`;
  }
}
