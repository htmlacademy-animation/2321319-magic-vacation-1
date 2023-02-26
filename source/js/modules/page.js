import FullPageScroll from "./full-page-scroll";
import AccentTypography from "./accent-typography";

const DOM_LOADED_CLASS = `is-dom-loaded`;

export default class Page {
  constructor() {
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);

    this.fullPageScroll = new FullPageScroll(this.screenElements);
    this.fullPageScroll.init();

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

    window.addEventListener(`load`, () => {
      const bodyElement = document.querySelector(`body`);
      setTimeout(() => {
        bodyElement.classList.add(DOM_LOADED_CLASS);
      }, 100);
    });

    document.body.addEventListener(`screenChanged`, (event) => {
      this.accentTypographyItems.forEach((item) => {
        if (item._screenId === event.detail.prevScreenName) {
          item._element.destroyAnimation();
        }
      });
      setTimeout(() => {
        this.accentTypographyItems.forEach((item) => {
          if (item._screenId === event.detail.screenName) {
            item._element.runAnimation();
          }
        });
      }, 200);
    });
  }
}
