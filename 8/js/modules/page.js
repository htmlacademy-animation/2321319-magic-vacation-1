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
    this.svgAnimations = [];
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
          _screenId: screen.id,
        });
      });
    });

    this.initSvgAnimations();

    window.addEventListener(`load`, () => {
      setTimeout(() => {
        this.bodyElement.classList.add(DOM_LOADED_CLASS);
      }, 100);
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
      if (item._screenId === event.detail.prevScreenName) {
        item._element.destroyAnimation();
      }
    });

    if (event.detail.screenId !== Screen.PRIZES) {
      [].forEach.call(this.svgAnimations, (animation) => {
        animation.element.endElement();
      });
    }
  }

  runAnimationsForScreen(event) {
    this.accentTypographyItems.forEach((item) => {
      if (item._screenId === event.detail.screenName) {
        item._element.runAnimation();
      }
    });

    if (event.detail.screenId === Screen.PRIZES) {
      [].forEach.call(this.svgAnimations, (animation) => {
        setTimeout(() => animation.element.beginElement(), animation.delay);
      });
    }
  }

  initSvgAnimations() {
    const svgAnimationsSettings = [
      {
        title: `airshipShow`,
        delay: 0
      },
      {
        title: `backgroundShow`,
        delay: 3000
      }
    ];
    svgAnimationsSettings.forEach((el) => {
      let svgAnimationElement = document.getElementById(el.title);
      if (svgAnimationElement) {
        this.svgAnimations.push({element: svgAnimationElement, delay: el.delay});
      }
    });
  }
}
