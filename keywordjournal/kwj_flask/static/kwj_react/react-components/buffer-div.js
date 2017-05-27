
/*
This is an experimental component to test the feasibility of rolling my own text editor.
 */


import React from "react";
import * as kwj_buffer from 'kwj_buffer';


export class BufferDiv extends React.Component {

  constructor(props) {
    super(props);

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
    this.renderText = this.renderText.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.gapBuffer = new kwj_buffer.CharacterBuffer();

    this.state = {
      leftText: '',
      rightText: ''
    };

  }

  handleClick(e) {
    console.log('');
    console.log(e.pageX);
    console.log(e.target.getBoundingClientRect().left);

    let clickPos = e.pageX;
    let closestIdx = 0;
    let closestPosDiff = 100;

    let leftOffsets = [];
    let text = e.target.textContent;

    e.target.textContent = '';
    for (let i=0; i < text.length; i++) {
      let textBefore = text.slice(0, i);
      let textAfter = text.slice(i);

      let span1 = document.createElement('span');
      let span2 = document.createElement('span');
      span1.textContent = textBefore;
      span2.textContent = textAfter;

      e.target.appendChild(span1);
      e.target.appendChild(span2);

      let span2Pos = span2.getBoundingClientRect().left;

      if (Math.abs(span2Pos - clickPos) < closestPosDiff) {
        closestIdx = i;
        closestPosDiff = Math.abs(span2Pos - clickPos);
      }

      while (e.target.firstChild) {
        e.target.removeChild(e.target.firstChild);
      }
    }

    console.log(closestIdx);

    e.target.textContent = text;

    let id = e.target.getAttribute('id');

    if (id === "text-2") {
      let firstHalfLength = document.getElementById("text-1").textContent.length;
      closestIdx += firstHalfLength;
    }

    this.gapBuffer.moveCursor(closestIdx);

    this.setState({
      leftText: this.gapBuffer.getTextBefore(),
      rightText: this.gapBuffer.getTextAfter()
    });



  }

  handleKeyStroke(e) {
    let typedChar = e.key;

    if (e.keyCode === 8) {  // backspace
      this.gapBuffer.deleteCurrent();
    }
    else if (e.key === 'Shift') {

    }

    else {
      this.gapBuffer.addCharacter(typedChar);
    }

    this.setState({
      leftText: this.gapBuffer.getTextBefore(),
      rightText: this.gapBuffer.getTextAfter()
    });

    console.log(this.gapBuffer.getAllText());


    let currentWordAnalysis = analyzeCurrentWord(this.state.text, this.gapBuffer.getCursorPos());

    console.log(currentWordAnalysis);
  }

  renderText() {
    return (
        <span>
          <span id="text-1" onClick={this.handleClick} style={{'position': 'relative', 'border-right': '1px solid black', 'margin-right': '-1px'}}>{this.state.leftText}</span>
          <span id="text-2" onClick={this.handleClick} style={{'position': 'relative'}}>{this.state.rightText}</span>
        </span>
    )
  }

  render() {
    console.log('meow');
    return (
        <div
          style={{'margin-left': '15px'}}
          onKeyDown={this.handleKeyStroke}
          tabIndex="0"
        >{this.renderText()}</div>
    )
  }
}
