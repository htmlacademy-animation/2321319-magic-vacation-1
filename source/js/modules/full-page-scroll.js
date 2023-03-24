import throttle from 'lodash/throttle';
import {Screen} from "../general/consts";

const cssTransitionClass = `screen--background-transitioned`;

export default class FullPageScroll {
  constructor(screens) {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = screens;
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
    this.replaceTransitionsForDisclaimer();
    this.runHiddenScreenTransition()
    .then(() => this.showTransitionedBackground())
    .then(() => {
      this.emitChangeDisplayEvent();
      this.changeVisibilityDisplay();
    });
  }

  runHiddenScreenTransition() {
    return new Promise((resolve, _reject) => {
      this.screenElements[this.prevScreen].classList.add(`screen--hidden-transitioned`);
      setTimeout(() => {
        this.screenElements[this.prevScreen].classList.add(`screen--hidden`);
        this.screenElements[this.prevScreen].classList.remove(`screen--hidden-transitioned`);
        resolve();
      }, 200);
    });
  }

  showTransitionedBackground() {
    return new Promise((resolve, _reject) => {
      const isShowBackground = [Screen.PRIZES, Screen.RULES, Screen.GAME].indexOf(this.activeScreen) !== -1
                              && [Screen.TOP, Screen.STORY].indexOf(this.prevScreen) !== -1;
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

  replaceTransitionsForDisclaimer() {
    if (this.prevScreen === Screen.PRIZES && this.activeScreen === Screen.RULES) {
      const disclaimerPrizes = document.querySelector(`.screen--prizes .js-footer`);
      const disclaimerRules = document.querySelector(`.screen--rules .screen__disclaimer`);
      disclaimerPrizes.classList.add(`no-transform`);
      disclaimerRules.classList.add(`no-transform`);
      setTimeout(() => {
        disclaimerPrizes.classList.remove(`no-transform`);
        disclaimerRules.classList.remove(`no-transform`);
      }, 600);
    }
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
        'screenElement': this.screenElements[this.activeScreen],
        'prevScreenId': this.prevScreen,
        'prevScreenName': this.screenElements[this.prevScreen].id,
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
