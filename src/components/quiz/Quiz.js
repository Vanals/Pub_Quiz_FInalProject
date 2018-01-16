import React, { Component } from 'react';
import MCQuestion from './MCQuestion';
import TextQuestion from './textQuestion';
import StartPage from './startPage';
import ToggleDisplay from 'react-toggle-display';
import client from '../../lib/wsClient';
import axios from 'axios';
import './Quiz.css'

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
      disabledButton: true,
      allScores: [],
      teamName: "",
      time: 10000
    }
    this.isFinished = this.isFinished.bind(this);
    this.getName = this.getName.bind(this);
    this.getScore = this.getScore.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
  };

  componentDidMount(){
    let quizId = this.props.match.params.quizId;
    let self = this;

    // axios.get(`http://pub-quiz-api.herokuapp.com/quiz/${quizId}`)
    axios.get(`http://localhost:5000/quiz/${quizId}`)
      .then(function (response) {
        self.setState({
          name: response.data.name,
          questions: response.data.questions,
          questionsRecieved: true,
          disabledButton: false,
          client: client.buildWsClient(this, 'ws://localhost:5000/ws/1')
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  hideButtonShowQuiz() {
    this.setState({
      show: true,
      teamName: document.getElementById('team-name').value,
      // client: client.buildWsClient(this, 'ws://pub-quiz-api.herokuapp.com/')
      // client: client.buildWsClient(this, 'ws://localhost:5000/ws/1')
    });
    this.state.client.start() 
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
      <div className='quiz'>

      <StartPage disabled={this.state.disabledButton} show={this.state.show} hideFunction={ () => this.hideButtonShowQuiz() }/>

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
    );
  };
};

export default Quiz;
