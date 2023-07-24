import {Screen} from "../general/consts";
import {hasReduceMotion} from "../general/helpers";

const CHAT_MESSAGE_CLASS = `chat__message`;
const CHAT_PLACEHOLDER_CLASS = `chat__placeholder`;

export default class Chat {
  constructor() {
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
    this.chatBlock.addEventListener(`wheel`, (event) => {
      event.stopPropagation();
    }, false);
  }

  postQuestion() {
    this.currentQuestion = this.messageField.value;
    if (this.currentQuestion) {
      const messageElement = this.createQuestionElement(this.currentQuestion);
      this.messageField.value = ``;
      this.messageField.setAttribute(`disabled`, `true`);
      this.setVisibility(messageElement);
      messageElement.style.position = `absolute`;

      this.messageList.appendChild(messageElement);
      this.setMessagesOffset(this.postQuestionAnimationCallback.bind(this));
    }
  }

  getAnswer() {
    const answerElement = this.createAnswerElement();
    this.setVisibility(answerElement);
    answerElement.style.position = `absolute`;

    this.messageList.appendChild(answerElement);
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
            "screenId": Screen.RESULT,
            "prevScreenId": Screen.GAME,
          }
        });
        document.body.dispatchEvent(event);
      } else if (this.currentQuestion.toLowerCase().includes(`антарктида?`)) {
        const event = new CustomEvent(`toScreenResult`, {
          detail: {
            "screenId": Screen.RESULT2,
            "prevScreenId": Screen.GAME,
          }
        });
        document.body.dispatchEvent(event);
      }
    }, 1200);
  }

  createQuestionElement(question) {
    const questionEl = document.createElement(`li`);
    questionEl.classList.add(`${CHAT_MESSAGE_CLASS}`);
    const text = document.createElement(`p`);
    text.innerText = question;
    questionEl.appendChild(text);
    questionEl.classList.add(`${CHAT_MESSAGE_CLASS}--outcoming`);
    return questionEl;
  }

  createAnswerElement() {
    const answerEl = document.createElement(`li`);
    const placeholder = document.createElement(`div`);
    const textEl = document.createElement(`p`);
    placeholder.classList.add(`${CHAT_PLACEHOLDER_CLASS}`);
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement(`span`);
      placeholder.appendChild(dot);
    }
    answerEl.appendChild(placeholder);
    answerEl.classList.add(`${CHAT_MESSAGE_CLASS}`);
    answerEl.classList.add(`${CHAT_MESSAGE_CLASS}--incoming`);
    answerEl.classList.add(`${CHAT_MESSAGE_CLASS}--last`);

    const answerText = this.getAnswerText();
    textEl.innerText = answerText;
    answerEl.appendChild(textEl);
    return answerEl;
  }

  getAnswerText() {
    const answer = Math.floor(Math.random() * 2);
    let answerText;

    if (answer || this.currentQuestion.toLowerCase().includes(`антарктида?`)) {
      answerText = `Да`;
    } else {
      answerText = `Нет`;
    }

    return answerText;
  }

  showAnswerText() {
    let lastMessage = document.querySelector(`.${CHAT_MESSAGE_CLASS}--last`);
    if (lastMessage) {
      let lastMessagePlaceholder =
        lastMessage.querySelector(`.${CHAT_PLACEHOLDER_CLASS}`);
      let lastMessageText = lastMessage.querySelector(`p`);
      lastMessageText.classList.add(`showed`);
      lastMessagePlaceholder.classList.add(`${CHAT_PLACEHOLDER_CLASS}--hidden`);
      setTimeout(() => {
        lastMessagePlaceholder.remove();
        this.messageField.removeAttribute(`disabled`);
        this.messageField.focus();
      }, 400);
      lastMessage.classList.remove(`${CHAT_MESSAGE_CLASS}--last`);
    }
  }

  setMessagesOffset(callback) {
    const offset = this.getMessageOffset();
    const messages = this.messageList.querySelectorAll(`.${CHAT_MESSAGE_CLASS}`);
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
    const messages = this.messageList.querySelectorAll(`.${CHAT_MESSAGE_CLASS}`);
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
    const messages = this.messageList.querySelectorAll(`.${CHAT_MESSAGE_CLASS}`);
    const lastQuestion = messages[messages.length - 1];
    const lastQuestionHeight = lastQuestion.offsetHeight;
    const marginBottom = parseFloat(window.getComputedStyle(lastQuestion).marginBottom);
    return lastQuestionHeight + marginBottom;
  }

  getAnimationSettings(offset, index) {
    return {
      keyframes: [
        {transform: `translateY(0)`, offset: 0},
        {transform: `translateY(-${offset}px)`, offset: 1},
      ],
      options: {
        duration: hasReduceMotion() ? 0 : 200,
        delay: index * 100,
        easing: `ease-out`,
        fill: `forwards`,
      },
    };
  }

  getAnimationUnsetSettings(offset) {
    return {
      keyframes: [
        {transform: `translateY(-${offset}px)`, offset: 0},
        {transform: `translateY(0)`, offset: 1},
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
