import Swiper from "swiper";
import {ThemeColor} from "../general/consts";

export default class Slider {
  constructor() {
    this.sliderContainer = document.getElementById(`story`);
    this.initSlideSettings();
    window.addEventListener(`resize`, () => {
      if (this.storySlider) {
        this.storySlider.destroy();
      }
      this.setSlider();
    });
    this.setSlider();
  }

  setSlider() {
    if (this.isMobileSlider()) {
      this.storySlider = new Swiper(`.js-slider`, {
        speed: 0,
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`,
        },
        keyboard: {
          enabled: true,
        },
        on: {
          slideChange: () => {
            const themeName = this.getStylesByActiveSlide();
            this.emitSlideChangedEvent(themeName);
          },
          resize: () => {
            this.storySlider.update();
          },
        },
        observer: true,
        observeParents: true,
      });
    } else {
      this.storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        speed: 0,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`,
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true,
        },
        on: {
          slideChange: () => {
            const themeName = this.getStylesByActiveSlide();
            this.emitSlideChangedEvent(themeName);
          },
          resize: () => {
            this.storySlider.update();
          },
        },
        observer: true,
        observeParents: true,
      });
    }
  }

  isMobileSlider() {
    return ((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769;
  }

  initSlideSettings() {
    this.slideSetings = {
      [ThemeColor.LIGHT_PURPLE]: {
        theme: ThemeColor.LIGHT_PURPLE,
        backgroundImage: `./img/module-5/scenes-textures/scene-1.png`
      },
      [ThemeColor.BLUE]: {
        theme: ThemeColor.BLUE,
        backgroundImage: `./img/module-5/scenes-textures/scene-2.png`
      },
      [ThemeColor.LIGHT_BLUE]: {
        theme: ThemeColor.LIGHT_BLUE,
        backgroundImage: `./img/module-5/scenes-textures/scene-3.png`
      },
      [ThemeColor.PURPLE]: {
        theme: ThemeColor.PURPLE,
        backgroundImage: `./img/module-5/scenes-textures/scene-4.png`
      },
    };
  }

  getStylesByActiveSlide() {
    return Object.values(this.slideSetings)[Math.floor(this.storySlider.activeIndex / 2)].theme;
  }

  getSlideSettings() {
    return this.slideSetings;
  }

  emitSlideChangedEvent(themeName) {
    const event = new CustomEvent(`slideChanged`, {
      detail: {
        'theme': themeName
      }
    });

    document.body.dispatchEvent(event);
  }
}
