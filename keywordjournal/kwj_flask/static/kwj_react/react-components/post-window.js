import React from "react";
import jQuery from "jquery";

import "textarea-helper";

import {KeyWordSelectionWindow} from "react-components/keyword-selection-window.js";
import {analyzeCurrentWord} from "postparser.js";
import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";
import {KeywordArgsWindow, NewArg} from "react-components/keyword-args-window";

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
      availableKeywords: [],
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

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
    this.keywordClicked= this.keywordClicked.bind(this);
    this.newArgSubmit = this.newArgSubmit.bind(this);
    this.finishedWithArgs = this.finishedWithArgs.bind(this);

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
      var matchingKeywords = getMatchingKeywords(currentWordAnalysis.enclosingWord.slice(1), this.state.availableKeywords);
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

    // var newText = currentText.substring(0, caretCursorPos - currentWord.length + 1) +
    //     clickedWord +
    //     currentText.substring(caretCursorPos + currentWord.length);

    this.setState({
      // bodyText: newText,
      clickedKeyword: clickedKeyword,
    });
    // $('#postTextarea').val(newText);
    document.getElementById("keyWordSelectionWindow").style.visibility = 'hidden';

    document.getElementById("keywordArgsWindow").style.visibility = 'visible';
    
    // document.getElementById("newKeyword").styl

  }

  finishedWithArgs(e, rid) {
    var $parent = $(e.currentTarget).parent();
    var $lis = $parent.find('li');

    var args = [];

    for (var i = 0; i < $lis.length; i++) {
      var $li = $($lis[i]);
      var name = $li.textContent;
      var value = $li.find('input').val();

      args.push({
        name: name,
        value: value,
      });
      
      $li.textContent = '';
      $li.find('input').val('');
    }

    var jsonArgs = JSON.stringify(args);

    var currentWord = this.state.currentWord;
    var caretCursorPos = this.state.caretCursorPos;
    var currentText = this.state.bodyText;
    var clickedKeyword = this.state.clickedKeyword;

    console.log('currentWord', currentWord);
    console.log('caretCursorPos', caretCursorPos);
    console.log('currentText', currentText);
    console.log('clickedKeyword', clickedKeyword);

    var newText = currentText.substring(0, caretCursorPos - currentWord.length + 1) +
        clickedKeyword.keyword + '<' + jsonArgs + '>' +
        currentText.substring(caretCursorPos);

    this.setState({
      bodyText: newText,
    });

    $('#postTextarea').val(newText);
    
    document.getElementById("keywordArgsWindow").style.visibility = 'hidden';
    document.getElementById("keywordArgsWindow").style.visibility = 'hidden';
    $('#postTextarea').focus();

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
           finishedWithArgs={this.finishedWithArgs}
        />
        <NewArg
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
