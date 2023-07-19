import PageRouter from "./page-router";
import GameTimer from "./game-timer";
import WebGLScene from "./webgl-scene";
import Chat from './chat.js';
import PrizeCountAnimation from "./prize-count-animation";
import ResultSealAnimation from "./result-seal-animation";
import ResultCrocodileAnimation from "./result-crocodile-animation";
import Slider from "./slider";
import AccentTypography from "./accent-typography";
import {ThemeColor, Screen} from "../general/consts";

const DOM_LOADED_CLASS = `is-dom-loaded`;

export default class Page {
  constructor() {
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.bodyElement = document.querySelector(`body`);

    this.pageRouter = new PageRouter(this.screenElements);
    this.pageRouter.init();
    this.swiper = new Slider();

    this.svgAnimations = {};
    this.jsAnimations = {};
    this.webGLScene = new WebGLScene(document.getElementById(`3d-scene`));
    this.gameChat = new Chat();
    this.gameTimer = new GameTimer(5, 1);
    this.setTheme();

    this.progress = 0;
    this.progressBar = document.querySelector(`.progress-bar-percent`);

    this.accentTypographyItems = [];
    this.initAccentTypographyAnimation();

    this.initSvgAnimations();
    this.initJsAnimations();

    window.addEventListener(`load`, () => {
      this.isDomLoaded = true;
    });

    document.body.addEventListener(`3dObjectsLoadProgress`, (event) => {
      this.on3dObjectsChangeProgress(event);
    });

    document.body.addEventListener(`3dObjectsLoad`, () => {
      this.on3dObjectsLoaded();
    });

    document.body.addEventListener(`screenResultChanged`, (event) => {
      if (!this.bodyElement.classList.contains(DOM_LOADED_CLASS)) {
        this.currentHandler = this.onScreenResultChanged;
        this.currentEvent = event;
        return;
      }
      this.onScreenResultChanged(event);
    });

    document.body.addEventListener(`screenChanged`, (event) => {
      if (!this.bodyElement.classList.contains(DOM_LOADED_CLASS)) {
        this.currentHandler = this.onScreenChanged;
        this.currentEvent = event;
        return;
      }
      this.onScreenChanged(event);
    });

    document.body.addEventListener(`slideChanged`, (event) => {
      if (!this.bodyElement.classList.contains(DOM_LOADED_CLASS)) {
        this.currentHandler = this.onSlideChanged;
        this.currentEvent = event;
        return;
      }
      this.onSlideChanged(event);
    });
  }

  on3dObjectsChangeProgress(event) {
    this.progress = event.detail.progress;
    this.progressBar.textContent = `${this.progress}%`;
  }

  on3dObjectsLoaded() {
    this.is3dObjectsLoaded = true;
    if (this.isDomLoaded) {
      this.progress = 99;
      this.progressBar.textContent = `${this.progress}%`;
      setTimeout(() => {
        this.progressBar.parentElement.remove();
        this.bodyElement.classList.add(DOM_LOADED_CLASS);
        if (this.currentHandler && this.currentEvent) {
          this.currentHandler(this.currentEvent);
        }
      }, 100);
    } else {
      setTimeout(() => {
        this.on3dObjectsLoaded();
      }, 100);
    }
  }

  onScreenResultChanged(event) {
    this.destroyAnimationsForPrevScreen(event);
    setTimeout(() => {
      this.runAnimationsForScreen(event);
    }, 200);
  }

  onScreenChanged(event) {
    this.reinitTheme(event);
    this.destroyAnimationsForPrevScreen(event);
    setTimeout(() => {
      this.runAnimationsForScreen(event);
    }, 200);
    this.updateTimerStatus(event.detail.screenId);
  }

  onSlideChanged(event) {
    this.clearTheme();
    this.setTheme(event.detail.theme);
    this.renderSceen3D(event.detail.theme);
  }

  setTheme(theme = ThemeColor.PURPLE) {
    this.bodyElement.classList.add(theme);
  }

  clearTheme() {
    if (this.bodyElement.classList.contains(DOM_LOADED_CLASS)) {
      this.bodyElement.classList = DOM_LOADED_CLASS;
    } else {
      this.bodyElement.classList = ``;
    }
  }

  reinitTheme(event) {
    let themeName;
    this.clearTheme();
    if (event.detail.screenId === Screen.STORY) {
      themeName = this.swiper.getStylesByActiveSlide();
      this.setTheme(themeName);
      this.renderSceen3D(themeName);
    }
    if (event.detail.screenId === Screen.TOP) {
      this.renderSceen3D(event.detail.screenId);
    }
    this.setTheme(themeName);
  }

  renderSceen3D(screenId) {
    this.webGLScene.renderSceneObject(screenId);
  }

  destroyAnimationsForPrevScreen(event) {
    this.accentTypographyItems.forEach((item) => {
      if (item._screenId === event.detail.prevScreenId) {
        item._element.destroyAnimation();
      }
    });

    if (this.svgAnimations[event.detail.prevScreenId]) {
      [].forEach.call(this.svgAnimations[event.detail.prevScreenId], (animation) => {
        animation.element.endElement();
      });
    }

    if (this.jsAnimations[event.detail.prevScreenId]) {
      [].forEach.call(this.jsAnimations[event.detail.prevScreenId], (animation) => {
        animation.element.stopAnimation();
      });
    }

    // if (event.detail.prevScreenId === Screen.STORY || event.detail.prevScreenId === Screen.TOP) {
    //   this.webGLScene.stopAnimation();
    // }
  }

  runAnimationsForScreen(event) {
    this.accentTypographyItems.forEach((item) => {
      if (item._screenId === event.detail.screenId) {
        item._element.runAnimation();
      }
    });

    if (this.svgAnimations[event.detail.screenId]) {
      [].forEach.call(this.svgAnimations[event.detail.screenId], (animation) => {
        setTimeout(() => animation.element.beginElement(), animation.delay);
      });
    }

    if (this.jsAnimations[event.detail.screenId]) {
      [].forEach.call(this.jsAnimations[event.detail.screenId], (animation) => {
        setTimeout(() => animation.element.startAnimation(), animation.delay);
        animation.element.setContainerWidth();
      });
    }
  }

  updateTimerStatus(screenId) {
    if (screenId === Screen.GAME) {
      setTimeout(() => {
        this.gameTimer.startTimer();
      }, 450); // TODO: уточнить время после завершения работы над экраном
    } else {
      this.gameTimer.stopTimer();
    }
  }

  initAccentTypographyAnimation() {
    [].forEach.call(this.screenElements, (screen) => {
      let accentTypographyElements = screen.querySelectorAll(`.accent-typography`);
      [].forEach.call(accentTypographyElements, (el, index) => {
        this.accentTypographyItems.push({
          _element: new AccentTypography(
              el,
              500,
              `accent-typography--transitioned`,
              `transform`,
              100 * index
          ),
          _screenId: Screen[screen.id.toUpperCase()],
        });
      });
    });
  }

  initSvgAnimations() {
    this.initPrizeAnimations();
    this.initResultsAnimations();
  }

  initJsAnimations() {
    this.jsAnimations[Screen.PRIZES] = [
      {
        element: new PrizeCountAnimation(3, 3, 0, 12, document.querySelector(`.prizes__item--journeys .prizes__desc`)),
        delay: 2000
      },
      {
        element: new PrizeCountAnimation(1, 7, 800, 12, document.querySelector(`.prizes__item--cases .prizes__desc`)),
        delay: 4000
      },
      {
        element: new PrizeCountAnimation(11, 900, 800, 12, document.querySelector(`.prizes__item--codes .prizes__desc`)),
        delay: 6000
      },
    ];
    this.jsAnimations[Screen.RESULT] = [
      {
        element: new ResultSealAnimation(document.getElementById(`seal-scene`)),
        delay: 0
      }
    ];
    this.jsAnimations[Screen.RESULT3] = [
      {
        element: new ResultCrocodileAnimation(document.getElementById(`crocodile-scene`)),
        delay: 0
      }
    ];
  }

  initPrizeAnimations() {
    const svgPrizeAnimationsSettings = [
      {
        id: `airshipShow`,
        delay: 0
      },
      {
        id: `backgroundShow`,
        delay: 3000
      },
      {
        id: `suitcaseShow`,
        delay: 5000
      }
    ];
    const svgPrizeAnimations = [];

    svgPrizeAnimationsSettings.forEach((el) => {
      let svgAnimationElement = document.getElementById(el.id);
      if (svgAnimationElement) {
        svgPrizeAnimations.push({element: svgAnimationElement, delay: el.delay});
      }
    });
    this.svgAnimations[Screen.PRIZES] = svgPrizeAnimations;
  }

  initResultsAnimations() {
    const svgResultAnimationsSettings = [
      {
        id: `result`,
        delay: 0,
        delayBetweenItems: 0
      },
      {
        id: `result2`,
        delay: 0,
        delayBetweenItems: 0
      },
      {
        id: `result3`,
        delay: 0,
        delayBetweenItems: 100
      }
    ];
    svgResultAnimationsSettings.forEach((el) => {
      let screenElement = document.getElementById(el.id);
      if (screenElement) {
        const svgResultsElements = screenElement.querySelectorAll(`.letter-drawing`);
        this.svgAnimations[Screen[el.id.toUpperCase()]] = [];
        [].forEach.call(svgResultsElements, (svgEl, index) => {
          this.setLetterAnimation(svgEl);
          this.svgAnimations[Screen[el.id.toUpperCase()]].push(
              {
                element: svgEl.firstChild, delay: el.delay + index * el.delayBetweenItems
              }
          );
        });
      }
    });
  }

  setLetterAnimation(svgElement) {
    const numberOfDrawingPoints = 3;
    const pathLength = svgElement.getTotalLength() / numberOfDrawingPoints;
    svgElement.setAttribute(`stroke-dasharray`, `0, ${pathLength}`);
    const animation = document.createElementNS(`http://www.w3.org/2000/svg`, `animate`);
    animation.setAttribute(`attributeName`, `stroke-dasharray`);
    animation.setAttribute(`begin`, `indefinite`);
    animation.setAttribute(`dur`, `0.6s`);
    animation.setAttribute(`calcMode`, `spline`);
    animation.setAttribute(`keySplines`, `0.21 0 0.8 1`);
    animation.setAttribute(`values`, `0, ${pathLength}; ${pathLength}, 0`);
    animation.setAttribute(`fill`, `freeze`);
    svgElement.appendChild(animation);
  }
}
