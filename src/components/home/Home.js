import React, { Component } from 'react';
import axios from 'axios';
import QuizList from './QuizList'

class Home extends Component {
  constructor(props){
    super(props);
    this.state = { quizzes: [] };
  }

  componentDidMount() {
    let self = this;
    // axios.get('http://pub-quiz-api.herokuapp.com/quiz')
    axios.get('http://localhost:5000/quiz')
      .then(function(response) {
        let state = self.state
        response.data.forEach(function(quiz, key) {
          state.quizzes.push({id: quiz._id, name: quiz.name});
        })
        self.setState(state)
      })
      .catch(function(error) {
        console.log(error);
      })
  }

  handleClickDeleteQuiz = (quizId) => {
    let self = this
    // axios.delete(`http://pub-quiz-api.herokuapp.com/quiz/${quizId}`)
    axios.delete(`http://localhost:5000/quiz/${quizId}`)
      .then(function(response) {
        console.log('delete request sent')
        let state = self.state
        for(var i = 0; i < state.quizzes.length; i++) {
          if(state.quizzes[i].id == quizId) {
              state.quizzes.splice(i, 1);
              break;
          }
        }
        self.setState(state)
      })
    }

  render() {
    return(
      <div>
        <h1>Home page</h1>
        <a href="/quiz/new"><button>Create a quiz!</button></a>
        {this.state.quizzes.length > 0 &&
          <QuizList
            quizzes = {this.state.quizzes}
            handleClickDeleteQuiz = {this.handleClickDeleteQuiz}
          />
        }
      </div>
    )
  }
}

export default Home;
