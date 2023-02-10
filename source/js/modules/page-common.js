const DOM_LOADED_CLASS = `is-dom-loaded`;
export default () => {
  window.addEventListener(`load`, () => {
    const bodyElement = document.querySelector(`body`);
    setTimeout(() => {
      bodyElement.classList.add(DOM_LOADED_CLASS);
    }, 100);
  });
};
