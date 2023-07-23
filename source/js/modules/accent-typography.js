import {hasReduceMotion} from "../general/helpers";

export default class AccentTypography {
  constructor(
      element,
      duration,
      classForActivate,
      property,
      delay = 0,
      timeOffsetDelta = 20
  ) {
    this.element = element;
    this.duration = hasReduceMotion() ? 0 : duration;
    this.classForActivate = classForActivate;
    this.property = property;
    this.delay = delay;
    this.timeOffsetDelta = timeOffsetDelta;

    this.prepareText();
  }

  createElement(letter, indexOfLetter) {
    const span = document.createElement(`span`);
    const timeOffset = hasReduceMotion() ? 0 : this.generateTimeOffset(indexOfLetter + 1);

    span.textContent = letter;
    span.style.transition = this.getTransition(timeOffset);

    return span;
  }

  getTransition(timeOffset) {
    return `${this.property} ${this.duration}ms ease ${
      this.delay + timeOffset
    }ms`;
  }

  generateTimeOffset(index) {
    return Math.round((Math.sin(1.5 * index + 0.3) + 2) * 50 + Math.random() * this.timeOffsetDelta);
  }

  prepareText() {
    if (!this.element) {
      return;
    }

    const text = this.element.textContent.trim().split(` `);

    const {length} = text;
    const content = text.reduce((fragmentParent, word, index) => {
      const wordElement = Array.from(word).reduce(
          (fragment, letter, indexOfLetter) => {
            fragment.appendChild(this.createElement(letter, indexOfLetter));
            return fragment;
          },
          document.createDocumentFragment()
      );

      const wordContainer = document.createElement(`span`);

      wordContainer.classList.add(`slogan__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      if (index < length - 1) {
        fragmentParent.appendChild(document.createTextNode(` `));
      }

      this.delay += 100;

      return fragmentParent;
    }, document.createDocumentFragment());

    this.element.innerHTML = ``;
    this.element.appendChild(content);
  }

  runAnimation() {
    if (!this.element) {
      return;
    }

    this.element.classList.add(this.classForActivate);
  }

  destroyAnimation() {
    this.element.classList.remove(this.classForActivate);
  }
}
