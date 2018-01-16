'use strict';

const URL = 'ws://localhost:5000';

class WsClient {
  constructor(component, ws, timeout = 2500) {
    this._component = component;
    this._ws = ws;
    this._timeout = timeout;
  };

  // incoming messages

  configure() {
    this._ws.onmessage = this.getRoute(this);
  };

  start() {
    this.startInterval(this._timeout);
  }

  getRoute(self) {
    return function route(event, json_obj = JSON) {
      let data = json_obj.parse(event.data);

      switch(data.type) {
        case 'question':
          self.updateQuestion(parseInt(data.question), parseInt(data.time));
          break;
        case 'endQuiz':
          self.sendScore(self.getName(), self.getScore());
          break;
        case 'scores':
          self.updateScores(data.scores);
          break;
      };
    };
  };

  updateQuestion(questionId, time) {
    this._component.updateQuestion(questionId, time);
  };

  updateScores(scores) {
    this._component.updateScores(scores);
  };

  // outgoing messages

  getSendMessage(self) {
    return function sendMessage() {
      if (self.getFinishedState()) {
        self.endInterval();
        self.sendQuizEnd();
      } else {
        self.sendQuestionId(self.getQuestionId() + 1);
      };
    };
  };

  getName() {
    return this._component.getName();
  };

  getScore() {
    return this._component.getScore();
  };

  getFinishedState() {
    return this._component.isFinished();
  };

  getQuestionId() {
    return this._component.getQuestion();
  };

  sendQuestionId(id, json_obj = JSON) {
    this._ws.send(this._questionIdMessage(id, json_obj));
  };

  _questionIdMessage(id, json_obj) {
    return json_obj.stringify({
      type: "question",
      question: id,
      time: this._timeout
    });
  };

  sendQuizStart(json_obj = JSON) {
    this._ws.send(this._quizStartMessage(json_obj));
  }

  _quizStartMessage(json_obj) {
    return json_obj.stringify({ type: "startQuiz" })
  }

  sendQuizEnd(json_obj = JSON) {
    this._ws.send(this._quizEndMessage(json_obj));
  };

  _quizEndMessage(json_obj) {
    return json_obj.stringify({ type: "endQuiz" });
  };

  sendScore(teamName, score, json_obj = JSON) {
    this._ws.send(this._scoreMessage(teamName, score, json_obj));
  }

  _scoreMessage(teamName, score, json_obj) {
    return json_obj.stringify(
      { type: "score", teamName: teamName, score: score }
    );
  };

  // intervals

  startInterval(timeout, func = setInterval) {
    let sendMessage = this.getSendMessage(this);
    this._intervalId = func(sendMessage, timeout);
  };

  endInterval(func = clearInterval) {
    func(this._intervalId);
  };
};

function newWs(url, constructor = WebSocket) {
  return new constructor(url);
};

function newWsClient(component, ws, constructor = WsClient) {
  return new constructor(component, ws);
};

function buildWsClient(component, url, constructor = newWsClient,
                       ws_constructor = newWs) {
  let ws = ws_constructor(url);
  let client = constructor(component, ws);
  client.configure();
  return client;
};

module.exports = { buildWsClient, WsClient };
