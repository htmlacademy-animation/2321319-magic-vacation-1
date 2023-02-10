import throttle from 'lodash/throttle';

const Screen = {
  INTRO: 0,
  STORY: 1,
  PRIZES: 2,
  RULES: 3,
  GAME: 4
};

const cssTransitionClass = `screen--background-transitioned`;

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.transitionedBackground = document.querySelector(`.screen--background`);

    this.activeScreen = 0;
    this.prevScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      const currentPosition = this.activeScreen;
      this.reCalculateActiveScreenPosition(evt.deltaY);
      if (currentPosition !== this.activeScreen) {
        this.prevScreen = currentPosition;
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.prevScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeActiveMenuItem();
    this.showTransitionedBackground().then(() => {
      this.changeVisibilityDisplay();
      this.emitChangeDisplayEvent();
    });
  }

  showTransitionedBackground() {
    return new Promise((resolve, _reject) => {
      const isShowBackground = (this.activeScreen === Screen.PRIZES || this.activeScreen === Screen.RULES || this.activeScreen === Screen.GAME) && (this.prevScreen === Screen.INTRO || this.prevScreen === Screen.STORY);
      if (this.transitionedBackground && isShowBackground) {
        this.transitionedBackground.classList.add(cssTransitionClass);
        setTimeout(() => {
          this.transitionedBackground.classList.remove(cssTransitionClass);
          resolve();
        }, 500);
      } else {
        resolve();
      }
    });
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
