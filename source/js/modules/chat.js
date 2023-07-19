import {Screen} from "../general/consts";

export default class Chat {
  constructor() {
    this.chatBody = document.querySelector(`.js-chat`);
    this.messageForm = document.getElementById(`message-form`);
    this.messageField = document.getElementById(`message-field`);
    this.messageList = document.getElementById(`messages`);
    this.chatBlock = document.querySelector(`.js-chat`);
    this.answerDelay = 700;
    this.currentQuestion = ``;

    this.messageForm.addEventListener(`submit`, (e) => {
      e.preventDefault();
      this.postQuestion();
    });
    this.chatBody.addEventListener(`wheel`, (event) => {
      event.stopPropagation();
    }, false);
  }

  postQuestion() {
    this.currentQuestion = this.messageField.value;
    if (this.currentQuestion) {
      const messageEl = this.createQuestionElement(this.currentQuestion);
      this.messageField.value = ``;
      this.messageField.setAttribute(`disabled`, `true`);
      this.setVisibility(messageEl);
      messageEl.style.position = `absolute`;

      this.messageList.appendChild(messageEl);
      this.setMessagesOffset(this.postQuestionAnimationCallback.bind(this));
    }
  }

  getAnswer() {
    const answerEl = this.createAnswerElement();
    this.setVisibility(answerEl);
    answerEl.style.position = `absolute`;

    this.messageList.appendChild(answerEl);
    this.setMessagesOffset(this.postAnswerAnimationCallback.bind(this));
  }

  scrollToBottom() {
    if (this.messageList.scrollHeight > this.chatBlock.offsetHeight) {
      this.chatBlock.scrollTop = this.messageList.scrollHeight;
    }
  }

  postQuestionAnimationCallback() {
    setTimeout(() => this.getAnswer(), this.answerDelay);
  }

  postAnswerAnimationCallback() {
    setTimeout(() => this.showAnswerText(), this.answerDelay);
    setTimeout(() => {
      if (this.currentQuestion.toLowerCase().includes(`это антарктида?`)) {
        const event = new CustomEvent(`toScreenResult`, {
          detail: {
            'screenId': Screen.RESULT,
            'prevScreenId': Screen.GAME,
          }
        });
        document.body.dispatchEvent(event);
      } else if (this.currentQuestion.toLowerCase().includes(`антарктида?`)) {
        const event = new CustomEvent(`toScreenResult`, {
          detail: {
            'screenId': Screen.RESULT2,
            'prevScreenId': Screen.GAME,
          }
        });
        document.body.dispatchEvent(event);
      }
    }, 1200);
  }

  createQuestionElement(question) {
    let questionEl = document.createElement(`li`);
    questionEl.classList.add(`chat__message`);
    let text = document.createElement(`p`);
    text.innerText = question;
    questionEl.appendChild(text);
    questionEl.classList.add(`chat__message--outcoming`);
    return questionEl;
  }

  createAnswerElement() {
    let answerEl = document.createElement(`li`);
    let placeholder = document.createElement(`div`);
    let textEl = document.createElement(`p`);
    placeholder.classList.add(`chat__placeholder`);
    for (let i = 0; i < 3; i++) {
      let dot = document.createElement(`span`);
      placeholder.appendChild(dot);
    }
    answerEl.appendChild(placeholder);
    answerEl.classList.add(`chat__message`);
    answerEl.classList.add(`chat__message--incoming`);
    answerEl.classList.add(`chat__message--last`);

    const answerText = this.getAnswerText();
    textEl.innerText = answerText;
    answerEl.appendChild(textEl);
    return answerEl;
  }

  getAnswerText() {
    let answer = Math.floor(Math.random() * 2);
    let answerText;

    if (answer || this.currentQuestion.toLowerCase().includes(`антарктида?`)) {
      answerText = `Да`;
    } else {
      answerText = `Нет`;
    }

    return answerText;
  }

  showAnswerText() {
    let lastMessage = document.querySelector(`.chat__message--last`);
    if (lastMessage) {
      let lastMessagePlaceholder =
        lastMessage.querySelector(`.chat__placeholder`);
      let lastMessageText = lastMessage.querySelector(`p`);
      lastMessageText.classList.add(`showed`);
      lastMessagePlaceholder.classList.add(`chat__placeholder--hidden`);
      setTimeout(() => {
        lastMessagePlaceholder.remove();
        this.messageField.removeAttribute(`disabled`);
        this.messageField.focus();
      }, 400);
      lastMessage.classList.remove(`chat__message--last`);
    }
  }

  setMessagesOffset(callback) {
    const offset = this.getMessageOffset();
    const messages = this.messageList.querySelectorAll(`.chat__message`);
    const shiftedMessages = [...messages].slice(0, -1);

    shiftedMessages.forEach((message, index) => {
      const settings = this.getAnimationSettings(offset, index);
      const animation = message.animate(settings.keyframes, settings.options);
      if (index === shiftedMessages.length - 1) {
        animation.onfinish = () => this.onFinishAnimation(callback);
      }
    });

    if (shiftedMessages.length === 0) {
      this.onFinishAnimation(callback);
    }
  }

  onFinishAnimation(callback) {
    const messages = this.messageList.querySelectorAll(`.chat__message`);
    const lastQuestion = messages[messages.length - 1];
    lastQuestion.style.position = `static`;

    messages.forEach((message) => {
      const settings = this.getAnimationUnsetSettings(this.getMessageOffset());
      message.animate(settings.keyframes, settings.options);
    });
    this.scrollToBottom();
    this.setVisibility(lastQuestion);

    if (callback && typeof callback === `function`) {
      callback();
    }
  }

  setVisibility(messageEl) {
    if (
      messageEl.style.visibility === `visible` ||
      messageEl.style.visibility === ``
    ) {
      messageEl.style.visibility = `hidden`;
    } else {
      messageEl.style.visibility = `visible`;
    }
  }

  getMessageOffset() {
    const messages = this.messageList.querySelectorAll(`.chat__message`);
    const lastQuestion = messages[messages.length - 1];
    const lastQuestionHeight = lastQuestion.offsetHeight;
    const marginBottom = parseFloat(window.getComputedStyle(lastQuestion).marginBottom);
    return lastQuestionHeight + marginBottom;
  }

  getAnimationSettings(offset, index) {
    return {
      keyframes: [
        { transform: `translateY(0)`, offset: 0 },
        { transform: `translateY(-${offset}px)`, offset: 1 },
      ],
      options: {
        duration: 200,
        delay: index * 100,
        easing: `ease-out`,
        fill: `forwards`,
      },
    };
  }

  getAnimationUnsetSettings(offset) {
    return {
      keyframes: [
        { transform: `translateY(-${offset}px)`, offset: 0 },
        { transform: `translateY(0)`, offset: 1 },
      ],
      options: {
        duration: 0,
        delay: 0,
        easing: `ease-out`,
        fill: `forwards`,
      },
    };
  }
}
