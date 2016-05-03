import React from "react";
import jQuery from "jquery";

import "textarea-helper";

import {KeyWordSelectionWindow} from "react-components/keyword-selection-window.js";
import {analyzeCurrentWord} from "postparser.js";

export class PostWindow extends React.Component {
  render() {
    return (
      <form method="post" action="api/post" className="postWindow">
        <HeaderWindow />
        <br />
        <BodyWindow />
        <br />
        <SubmitPost />
        <p>Hello World!</p>
      </form>
    );
  }
};

class HeaderWindow extends React.Component {
  render() {
    return (
      <div className="headerWindow">
        <input type="text" placeholder="Title here" name="post_title" />
      </div>
    )
  }
}

class BodyWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({bodyText: '', currentWord: ''});

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
  }

  handleKeyStroke(e) {
    var text = e.target.value;
    this.setState({bodyText: text});

    var $text_area = $('#postTextarea');
    var caretCursorPos = $text_area.textareaHelper('getOriginalCaretPos');
    var caretPixelPos = $text_area.textareaHelper('caretPos');

    var currentWordAnalysis = analyzeCurrentWord(text, caretCursorPos);
    console.log(currentWordAnalysis);
    this.setState({currentWord: currentWordAnalysis.enclosingWord});

    var selectionWindowEl = document.getElementById("keyWordSelectionWindow");

    if (currentWordAnalysis.isTag === true) {
      selectionWindowEl.style.visibility = 'visible';
      var top = caretPixelPos.top.toString() + 'px';
      var left = (caretPixelPos.left + 5).toString() + 'px';
    }
    else {
      selectionWindowEl.style.visibility = 'hidden';
    }



    selectionWindowEl.style.top = top;
    selectionWindowEl.style.left = left;
  }

  render() {
    return (
      <div className="bodyWindow">
        <textarea
          id="postTextarea"
          name="post_body"
          cols="100" rows="15"
          placeholder="Post body here"
          onChange={this.handleKeyStroke}
        />
        <KeyWordSelectionWindow
          currentWord={this.state.currentWord}
        />
      </div>
    );
  }
};

class SubmitPost extends React.Component {
  render() {
    return (
      <input type="submit" className="submitPost" value="Submit Post" />
    );
  }
}
