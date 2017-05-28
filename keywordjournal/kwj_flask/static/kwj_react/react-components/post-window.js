import React from "react";
import jQuery from "jquery";

import "textarea-helper";

import {KeyWordSelectionWindow} from "react-components/keyword-selection-window.js";
import {analyzeCurrentWord} from "postparser.js";
import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";
import {KeywordArgsWindow, NewArg} from "react-components/keyword-args-window";
import {TextEditor} from "react-components/text-editor.js";

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
}


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
      clickedKeyword: undefined,
      matchingWords: [],
      availableKeywords: [],
      caretPos: {x: 0, y: 0},
      keywordArgs: undefined,
    });
    var that = this;
    $.ajax({
      url: '/api/tags_and_args',
      method: 'GET',
      dataType: 'json',
      success: function(data, status, jqXHR) {
        that.setState({availableKeywords: data.data})
      },
      error: function(jqXHR, status, error) {
        var x = 0;
      }

    });

    this.setKeywordInEditor = undefined;

    this.keywordClicked= this.keywordClicked.bind(this);
    this.newArgSubmit = this.newArgSubmit.bind(this);
    this.finishedWithArgs = this.finishedWithArgs.bind(this);
    this.updateCurrentWord = this.updateCurrentWord.bind(this);
    this.updateCaretPos = this.updateCaretPos.bind(this);
    this.registerSetKeywordInEditor = this.registerSetKeywordInEditor.bind(this);
  }

  keywordClicked(e, rid, clickedKeyword) {
    // var currentWord = this.state.currentWord;
    // var clickedWord = e.currentTarget.textContent;
    // var caretCursorPos = this.state.caretCursorPos;
    // var currentText = this.state.bodyText;
    // var clickedKeyword = this.state.availableKeywords[key];

    // var newText = currentText.substring(0, caretCursorPos - currentWord.length + 1) +
    //     clickedWord +
    //     currentText.substring(caretCursorPos + currentWord.length);

    this.setState({
      // bodyText: newText,
      clickedKeyword: clickedKeyword,
    });
    // $('#postTextarea').val(newText);
    // document.getElementById("keyWordSelectionWindow").style.visibility = 'hidden';
    //
    // document.getElementById("keywordArgsWindow").style.visibility = 'visible';

    // document.getElementById("newKeyword").styl

  }

  finishedWithArgs(args) {
    this.setKeywordInEditor(this.state.clickedKeyword, args);
    this.setState({
      clickedKeyword: undefined,
      currentWord: '',
    });

  }

  registerSetKeywordInEditor(func) {
    this.setKeywordInEditor = func;
  }
  
  newArgClicked() {
    document.getElementById("newArg").style.visibility = 'visible';
  }

  newArgSubmit(e, rid) {
    document.getElementById("newArg").style.visibility = 'hidden';

    var $parent = $(e.currentTarget).parent();
    var $argName = $parent.children('#arg-name');
    var $argType = $parent.children('#arg-type');
    var newArg = {
      name: $argName.val(),
      type: $argType.val(),
    };
    var clickedKeyword = this.state.clickedKeyword;

    var that = this;
    $.ajax({
      url: '/api/new_arg',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        keyword: clickedKeyword.keyword,
        arg: newArg
      }),

      success: function(data, status, jqXHR) {
        console.log('success!');
        clickedKeyword.args.push(newArg);
        that.setState({
          clickedKeyword: clickedKeyword
        });
      },
      error: function(jqXHR, status, error) {
        console.log('error!');
        var x = 0;
      }

    });

    console.log(newArg);
  }

  updateCurrentWord(word) {
    this.setState({currentWord: word});
  }

  updateCaretPos(caretPos) {
    this.setState({caretPos: caretPos});
  }

  render() {
    return (
      <div className="bodyWindow">
        <TextEditor
          updateCurrentWord={this.updateCurrentWord}
          updateCaretPos = {this.updateCaretPos}
          registerSetKeywordInEditor = {this.registerSetKeywordInEditor}
        />

        <KeyWordSelectionWindow
          currentWord={this.state.currentWord}
          caretPos={this.state.caretPos}
          keywordClicked={this.keywordClicked}
        />
        <KeywordArgsWindow
           keyword={this.state.clickedKeyword}
           newArgClicked={this.newArgClicked}
           finishedWithArgs={this.finishedWithArgs}
        />
        <NewArg
          newArgSubmit={this.newArgSubmit}
        />
      </div>
    );
  }
}

class SubmitPost extends React.Component {
  render() {
    return (
      <input type="submit" className="submitPost" value="Submit Post" />
    );
  }
}
