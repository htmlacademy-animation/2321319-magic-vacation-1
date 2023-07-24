const PAGE_HEADER_MENU_OPENED_CLASS = `page-header--menu-opened`;
const MENU_OPENED_CLASS = `menu-opened`;

export default () => {
  let header = document.querySelector(`.js-header`);
  let menuToggler = document.querySelector(`.js-menu-toggler`);
  let menuLinks = document.querySelectorAll(`.js-menu-link`);

  if (menuToggler) {
    menuToggler.addEventListener(`click`, function () {
      if (header.classList.contains(PAGE_HEADER_MENU_OPENED_CLASS)) {
        header.classList.remove(PAGE_HEADER_MENU_OPENED_CLASS);
        document.body.classList.remove(MENU_OPENED_CLASS);
      } else {
        header.classList.add(PAGE_HEADER_MENU_OPENED_CLASS);
        document.body.classList.add(MENU_OPENED_CLASS);
      }
    });
  }

  for (let i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener(`click`, function () {
      if (window.innerWidth < 1025) {
        header.classList.remove(PAGE_HEADER_MENU_OPENED_CLASS);
        document.body.classList.remove(MENU_OPENED_CLASS);
      }
    });
  }
};
