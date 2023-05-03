import FullPageScroll from "./full-page-scroll";
import GameTimer from "./game-timer";
import WebGLScene from "./webgl-scene";
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

    this.fullPageScroll = new FullPageScroll(this.screenElements);
    this.fullPageScroll.init();
    this.swiper = new Slider();

    this.svgAnimations = {};
    this.jsAnimations = {};
    this.webGLObjects = {};

    this.initWebGLObjects();
    this.webGLScene = new WebGLScene(document.getElementById(`3d-scene`), this.webGLObjects);
    this.gameTimer = new GameTimer(5, 1);
    this.setTheme();

    this.accentTypographyItems = [];
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

    this.initSvgAnimations();
    this.initJsAnimations();

    window.addEventListener(`load`, () => {
      setTimeout(() => {
        this.bodyElement.classList.add(DOM_LOADED_CLASS);
      }, 100);
    });

    document.body.addEventListener(`screenResultChanged`, (event) => {
      this.destroyAnimationsForPrevScreen(event);
      setTimeout(() => {
        this.runAnimationsForScreen(event);
      }, 200);
    });

    document.body.addEventListener(`screenChanged`, (event) => {
      this.reinitTheme(event);
      this.destroyAnimationsForPrevScreen(event);
      setTimeout(() => {
        this.runAnimationsForScreen(event);
      }, 200);
      this.updateTimerStatus(event.detail.screenId);
    });

    document.body.addEventListener(`slideChanged`, (event) => {
      this.clearTheme();
      this.setTheme(event.detail.theme);
      this.renderSceen3D(event.detail.theme);
    });
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

  initWebGLObjects() {
    const slideSettings = this.swiper.getSlideSettings();
    const imageWidth = 2048;
    const imageHeight = 1024;
    this.webGLObjects[Screen.TOP] = {
      url: `./img/module-5/scenes-textures/scene-0.png`,
      position: {
        x: 0,
        y: 0,
        z: 0,
        width: imageWidth,
        height: imageHeight
      },
      hue: 0.0,
      bubbles: []
    };
    Object.entries(slideSettings).forEach(([key, value], index) => {
      this.webGLObjects[key] = {
        url: value.backgroundImage,
        position: {
          x: imageWidth * (index + 1),
          y: 0,
          z: 0,
          width: imageWidth,
          height: imageHeight
        },
        hue: index === 1 ? -12.0 : 0.0,
        // нормализованные координаты
        bubbles: index === 1
          ? [
            {
              center: { x: 0.45, y: 0.75 },
              radius: 0.08,
            },
            {
              center: { x: 0.3, y: 0.6 },
              radius: 0.06,
            },
            {
              center: { x: 0.49, y: 0.4 },
              radius: 0.03,
            }
          ]
          : []
      };
    });
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
