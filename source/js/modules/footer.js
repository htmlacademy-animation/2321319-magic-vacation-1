const FOOTER_CLASS = `screen__footer--full`;
const FOOTER_TRANSITIONED_CLASS = `${FOOTER_CLASS}-transitioned`;

export default () => {
  const footerTogglers = document.querySelectorAll(`.js-footer-toggler`);
  if (footerTogglers.length) {
    for (let i = 0; i < footerTogglers.length; i++) {
      footerTogglers[i].addEventListener(`click`, function () {
        let footer = footerTogglers[i].parentNode;
        if (footer.classList.contains(`${FOOTER_CLASS}`)) {
          footer.classList.add(`${FOOTER_TRANSITIONED_CLASS}`);
          setTimeout(() => {
            footer.classList.remove(`${FOOTER_TRANSITIONED_CLASS}`);
            footer.classList.remove(`${FOOTER_CLASS}`);
          }, 700);
        } else {
          footer.classList.add(`${FOOTER_CLASS}`);
        }
      });
    }
  }
};
