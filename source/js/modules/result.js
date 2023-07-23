import {Screen} from "../general/consts";

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);

        const event = new CustomEvent(`toScreenResult`, {
          detail: {
            "screenId": Screen[target.toUpperCase()],
            "prevScreenId": Screen.GAME,
          }
        });
        document.body.dispatchEvent(event);
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        const event = new CustomEvent(`fromScreenResult`, {
          detail: {
            "screenId": Screen.GAME,
            "prevScreenId": Screen.RESULT3,
          }
        });
        document.body.dispatchEvent(event);
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }
};
