import {Screen} from "../general/consts";

export default class GameTimer {
  constructor(sessionTime, fps) {
    this.sessionTime = sessionTime;
    this.frameInterval = 1000 / fps;
    this.timerMinElement = document.querySelector(`.game__counter-min`);
    this.timerSecElement = document.querySelector(`.game__counter-sec`);
    this.runnungAnimation = null;
    this.endTime = null;
    this.lastFrameTime = null;
    this.isFirstDrawing = true;
  }

  startTimer() {
    if (!this.timerMinElement || !this.timerSecElement) {
      return;
    }

    this.stopTimer();
    if (this.isFirstDrawing) {
      this.setCounterMinWidth();
    }

    const startTime = Date.now();
    this.endTime = startTime + this.sessionTime * 60000;
    this.lastFrameTime = startTime - 50;
    this.isFirstDrawing = false;
    this.tick();
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    if (now >= this.endTime) {
      this.stopTimer();
      this.triggerLoseScreen();
      return;
    }

    this.runnungAnimation = requestAnimationFrame(() => this.tick());

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);
      const remainingTime = new Date(this.endTime - now);
      this.setTime(remainingTime.getMinutes(), remainingTime.getSeconds());
    }
  }

  stopTimer() {
    if (this.runnungAnimation) {
      cancelAnimationFrame(this.runnungAnimation);
      this.runnungAnimation = this.endTime = this.lastFrameTime = null;
      this.setTime(this.sessionTime, 0);
    }
  }

  triggerLoseScreen() {
    const event = new CustomEvent(`toScreenResult`, {
      detail: {
        "screenId": Screen.RESULT3,
        "prevScreenId": Screen.GAME,
      }
    });
    document.body.dispatchEvent(event);
  }

  setTime(min, sec) {
    this.timerMinElement.textContent = String(min).padStart(2, `0`);
    this.timerSecElement.textContent = String(sec).padStart(2, `0`);
  }

  setCounterMinWidth() {
    const counter = this.timerMinElement.parentElement;
    counter.style.minWidth = `calc(${counter.clientWidth}px + 1rem)`;
    counter.style.opacity = 1;
  }
}
