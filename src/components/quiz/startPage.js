import React, { Component } from 'react';
import ToggleDisplay from 'react-toggle-display';
import './startPage.css'

class StartPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ToggleDisplay if={!this.props.show}>
      <div>
      <h1 id='titleApp'>Pub-Quiz</h1>
      <input className='textArea' type='text' placeholder='Team Name' id='team-name'/>
      <button id='startQuizButton' type="button" onClick={this.props.hideFunction} disabled={this.props.disabled}>Start QUIZ!</button>
      </div>
      </ToggleDisplay>
    )
  }
}

export default StartPage;
