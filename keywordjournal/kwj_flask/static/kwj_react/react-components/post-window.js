import React from "react";
import jQuery from "jquery";

import "textarea-helper";

import {KeyWordSelectionWindow} from "react-components/keyword-selection-window.js";
import {analyzeCurrentWord} from "postparser.js";
import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";
import {KeywordArgsWindow, NewKeyword} from "react-components/keyword-args-window";

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
    this.state = ({
      bodyText: '',
      currentWord: '',
      clickedKeyword: {},
      matchingWords: [],
      availableKeywords: getAvailableKeywords(),
    });

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
    this.keywordClicked= this.keywordClicked.bind(this);
    this.newArgSubmit = this.newArgSubmit.bind(this);

    //document.getElementById("keywordArgsWindow").style.visibility = 'hidden';
  }

  handleKeyStroke(e) {
    var text = e.target.value;
    this.setState({bodyText: text});

    var $text_area = $('#postTextarea');
    var caretCursorPos = $text_area.textareaHelper('getOriginalCaretPos');
    var caretPixelPos = $text_area.textareaHelper('caretPos');

    var currentWordAnalysis = analyzeCurrentWord(text, caretCursorPos);
    console.log(currentWordAnalysis);
    this.setState({
      currentWord: currentWordAnalysis.enclosingWord,
      caretCursorPos: caretCursorPos,
    });

    var selectionWindowEl = document.getElementById("keyWordSelectionWindow");

    if (currentWordAnalysis.isTag === true) {
      var matchingKeywords = getMatchingKeywords(currentWordAnalysis.enclosingWord.slice(1));
      this.setState({matchingWords: matchingKeywords});
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

  keywordClicked(e, rid, key) {
    var currentWord = this.state.currentWord;
    var clickedWord = e.currentTarget.textContent;
    var caretCursorPos = this.state.caretCursorPos;
    var currentText = this.state.bodyText;
    var clickedKeyword = this.state.availableKeywords[key];

    var newText = currentText.substring(0, caretCursorPos - currentWord.length + 1) +
        clickedWord +
        currentText.substring(caretCursorPos + currentWord.length);

    this.setState({
      bodyText: newText,
      clickedKeyword: clickedKeyword,
    });
    $('#postTextarea').val(newText);
    document.getElementById("keyWordSelectionWindow").style.visibility = 'hidden';

    document.getElementById("keywordArgsWindow").style.visibility = 'visible';
    
    // document.getElementById("newKeyword").styl

  }
  
  newArgClicked() {
    document.getElementById("newKeyword").style.visibility = 'visible';
  }

  newArgSubmit(e, rid) {
    document.getElementById("newKeyword").style.visibility = 'hidden';

    var $parent = $(e.currentTarget).parent();
    var $argName = $parent.children('#arg-name');
    var $argType = $parent.children('#arg-type');
    var newArg = {
      name: $argName.val(),
      type: $argType.val(),
    };
    var clickedKeyword = this.state.clickedKeyword;
    clickedKeyword.args.push(newArg);
    this.setState({
      clickedKeyword: clickedKeyword,
    });

    console.log(newArg);
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
          matchingKeywords={this.state.matchingWords}
          keywordClicked={this.keywordClicked}
        />
        <KeywordArgsWindow
           keyword={this.state.clickedKeyword}
           newArgClicked={this.newArgClicked}
        />
        <NewKeyword 
          newArgSubmit={this.newArgSubmit}
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
