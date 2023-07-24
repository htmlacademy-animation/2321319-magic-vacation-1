export default () => {
  setVH();
  window.addEventListener(`resize`, setVH);
};

function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty(`--vh`, `${vh}px`);
}
