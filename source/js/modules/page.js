import FullPageScroll from "./full-page-scroll";
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
    });

    document.body.addEventListener(`slideChanged`, (event) => {
      this.clearTheme();
      this.setTheme(event.detail.theme);
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
      [themeName] = this.swiper.getStylesByActiveSlide();
    }
    this.setTheme(themeName);
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
  }

  initSvgAnimations() {
    this.initPrizeAnimations();
    this.initResultsAnimations();
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
