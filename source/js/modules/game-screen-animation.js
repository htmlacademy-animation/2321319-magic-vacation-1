import Chat from './chat.js';
import GameTimer from "./game-timer";

export default class GameScreenAnimation {
  constructor(screenElement) {
    this.screenElement = screenElement;
    this.gameChat = new Chat();
    this.gameTimer = new GameTimer(5, 1);
    this.aiElement = screenElement.querySelector(`.game_ai`);
    const translateX = this.aiElement.width;
    const translateY = this.aiElement.height;
    this.showAnimationSettings = {
      keyframes: [
        { opacity: 0, offset: 0 },
        {
          opacity: 1,
          transform: `translate(${translateX}px, ${translateY}px) rotate(-30deg)`,
          offset: 0.01,
        },
        { transform: `translate(0, 0) rotate(0deg)`, offset: 1 },
      ],
      options: {
        duration: 600,
        easing: `ease-out`,
        fill: `both`,
      },
    };

    this.backgroundAnimationSettings = {
      keyframes: [
        { transform: `translate(0, 0) rotate(0deg)`, offset: 0 },
        { transform: `translate(0, 2rem) rotate(0deg)`, offset: 1 },
      ],
      options: {
        duration: 1500,
        easing: `ease-in-out`,
        fill: `both`,
        iterations: Infinity,
        direction: `alternate`,
      },
    };
    this.isReversedAnimation = false;
    this.initAnimation();
  }

  updateTimerStatus() {
    setTimeout(() => {
      this.gameTimer.startTimer();
    }, 450); // TODO: уточнить время после завершения работы над экраном
  }

  stopTimer() {
    this.gameTimer.stopTimer();
  }

  initAnimation() {
    if (!this.aiElement) {
      return;
    }
    this.showAnimation = this.aiElement.animate(
      this.showAnimationSettings.keyframes,
      this.showAnimationSettings.options
    );
    this.showAnimation.pause();
  }

  startAnimation() {
    if (this.isReversedAnimation) {
      this.showAnimation.reverse();
      this.isReversedAnimation = false;
    }
    this.showAnimation.onfinish = () => {
      this.backgroundAnimation = this.aiElement.animate(
        this.backgroundAnimationSettings.keyframes,
        this.backgroundAnimationSettings.options
      );
    };
    this.showAnimation.play();
  }

  startQuitAnimation() {
    if (!this.aiElement) {
      return;
    }
    this.stopAnimation();

    this.showAnimation.reverse();
    this.isReversedAnimation = true;
    this.showAnimation.play();
  }

  stopAnimation() {
    this.backgroundAnimation.cancel();
    this.showAnimation.onfinish = null;
    this.showAnimation.finish();
  }

  setContainerWidth() {}
}
