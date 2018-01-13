import React, { Component } from 'react';
import NewQuizOption from './NewQuizOption';
import AddOptionButton from './AddOptionButton'
import RemoveQuestionButton from './RemoveQuestionButton'
import NewQuizAnswer from './NewQuizAnswer'

class NewQuizQuestion extends Component {

  render(){
    return(
      <div>
        <div style={localStyles.questionRow}>
          <div>
            {'Q' + (this.props.index + 1)}
          </div>
        <input
          type="text"
          placeholder={this.props.question.placeholder}
          value={this.props.question.text}
          onChange={(event)=>this.props.handleChangeQuestion(this.props.index, event)} >
        </input>
        <RemoveQuestionButton
          removeQuestion={this.props.removeQuestion}
          index={this.props.index}
        />
        <AddOptionButton
          questionIndex={this.props.index}
          addOption={this.props.addOption}
        />
      </div>
      <div>
        { this.props.question.options.map((option, index) => {
            return (
              <NewQuizOption
                key={index}
                index={index}
                option={option}
                questionIndex={this.props.index}
                handleChangeOption={this.props.handleChangeOption}
                removeOption={this.props.removeOption}
              />
            )
          }
        )}
      </div>
      <div>
        { this.props.question.answer.map((answer, index) => {
            return (
              <NewQuizAnswer
                key={index}
                index={index}
                answer={answer}
                options={this.props.question.options}
                questionIndex={this.props.index}
                handleChangeAnswer={this.props.handleChangeAnswer}
              />
            )
          }
        )}
      </div>
    </div>
    );
  };
};

const localStyles = {
  questionRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
  },
}

export default NewQuizQuestion;