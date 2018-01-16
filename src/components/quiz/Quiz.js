import React, { Component } from 'react';
import MCQuestion from './MCQuestion';
import TextQuestion from './textQuestion';
import StartPage from './startPage';
import ShareableLink from './ShareableLink'
import ToggleDisplay from 'react-toggle-display';
import client from '../../lib/wsClient';
import axios from 'axios';
import './Quiz.css'

const URL = 'localhost:5000'
// const URL = 'pub-quiz-api.herokuapp.com'

class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'Loading',
      questions: [],
      questionsRecieved: false,
      number: 0,
      score: 0,
      show: false,
      allScores: [],
      teamName: "",
      time: 10000,
      wsId: null
    }
    this.isFinished = this.isFinished.bind(this);
    this.getName = this.getName.bind(this);
    this.getScore = this.getScore.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
  };

  componentDidMount(){
    let quizId = this.props.match.params.quizId;
    let self = this;
    var wsId = new URLSearchParams(window.location.search).get('id')

    axios.get(`http://${URL}/quiz/${quizId}`)
      .then(function (response) {
        self.setState({
          name: response.data.name,
          questions: response.data.questions,
          questionsRecieved: true
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    if(wsId) {
      self.connect(wsId)
    } else {
      axios.get(`http://${URL}/play`)
      .then(function (response) {
        self.connect(response.data.id)
      })
    }
  };

  connect(id) {
    var state = this.state
    state.client = client.buildWsClient(this, `ws://${URL}/play/${id}`)
    state.wsId = id
    this.setState(state)
  }

  hideButtonShowQuiz() {
    this.setState({
      show: true,
      teamName: document.getElementById('team-name').value
    });
    this.state.client.start();
  };

  updateScores(scores) {
    this.setState({ allScores: scores });
  };

  updateQuestion(id, time) {
    let self = this;
    let radios = document.getElementsByName('options');
    let textArea = document.getElementById('textAnswer')
    let answer = this.state.questions[this.state.number].answer[0];
    if (this.state.questions[this.state.number].type === 'MultipleChoice'){
      radios.forEach(function(option) {
        if (option.checked === true && option.value === answer.text) {
          self.state.score += 1;
        };
        option.checked = false
      });
    } else {
      if (this.state.questions[this.state.number].answer[0].text.includes(textArea.value.toLowerCase())) {
        self.state.score += 1;
      };
    };
    this.setState({ number: parseInt(id), time: time });
  };

  isFinished() {
    return this.getQuestion() === this.state.questions.length;
  };

  getName() {
    return this.state.teamName;
  };

  getQuestion() {
    return this.state.number;
  };

  getScore() {
    return this.state.score;
  };

  render() {
    let number = this.state.number;
    let question = this.state.questions[number];
    let time = this.state.time;
    return (
      <div>
        <div className='quiz'>

          <StartPage
            show={this.state.show}
            hideFunction={ () => this.hideButtonShowQuiz() }
          />

          <ToggleDisplay show={this.state.show}>
          <h1>{this.state.name}</h1>
          { this.state.questions.length > 0 && this.state.number < this.state.questions.length && this.state.questions[this.state.number].type === 'MultipleChoice' &&
              <MCQuestion question={this.state.questions[this.state.number]} time={time} />
          }
          { this.state.questions.length > 0 && this.state.number < this.state.questions.length && this.state.questions[this.state.number].type === 'text' &&
              <TextQuestion question={this.state.questions[this.state.number]} time={time} />
          }
          { this.state.number >= this.state.questions.length &&
            <div>
              <h2> Thanks for playing! </h2>
              <h3> Your score was {this.state.score} </h3>
            </div>
          }
          {this.state.allScores.length > 0 &&
            this.state.allScores.map(function(score, index) {
            return(
              <div key={index}>
                <h4> {score.teamName}: {score.score} </h4>
              </div>
              )
            })
          }
          </ToggleDisplay>

        </div>
        <div className='shareable-link'>
          <ShareableLink
            wsId={this.state.wsId}
          />
        </div>
      </div>
    );
  };
};

export default Quiz;