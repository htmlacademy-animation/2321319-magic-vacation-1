import Swiper from "swiper";
import {ThemeColor} from "../general/consts";

export default class Slider {
  constructor() {
    this.sliderContainer = document.getElementById(`story`);
    window.addEventListener(`resize`, () => {
      const currentSlide = this.storySlider.activeIndex;
      if (this.storySlider) {
        this.storySlider.destroy();
      }
      this.setSlider();
      this.storySlider.slideTo(currentSlide, 0);
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
          slideChange: () => this.onSlideChange(),
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
          slideChange: () => this.onSlideChange(),
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

  getStylesByActiveSlide() {
    return Object.values(ThemeColor)[Math.floor(this.storySlider.activeIndex / 2)];
  }

  onBeforeSlideChange() {
    const currentSlide = this.sliderContainer.querySelector(`.swiper-slide-active`);
    if (currentSlide === null) {
      return;
    }
    currentSlide.classList.add(`slide-hidden-transitioned`);
    if (!this.isMobileSlider() && currentSlide !== null) {
      const nextSlide = this.sliderContainer.querySelector(`.swiper-slide-next`);
      nextSlide.classList.add(`slide-hidden-transitioned`);
    }
  }

  onSlideChange() {
    this.onBeforeSlideChange();
    setTimeout(() => {
      const transitionedSlides = this.sliderContainer.querySelectorAll(`.slide-hidden-transitioned`);
      transitionedSlides.forEach((slide) => {
        slide.classList.remove(`slide-hidden-transitioned`);
      });
      const themeName = this.getStylesByActiveSlide();
      this.emitSlideChangedEvent(themeName);
    }, 500);
  }

  emitSlideChangedEvent(themeName) {
    const event = new CustomEvent(`slideChanged`, {
      detail: {
        theme: themeName
      }
    });

    document.body.dispatchEvent(event);
  }
}
