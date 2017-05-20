import React from "react";
import jQuery from "jquery";
import * as kwj_buffer from 'kwj_buffer';
//import foo, * as ckeditor from 'ckeditor'

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
        <BufferDiv />
        <p>Goodbye@</p>
      </form>
    );
  }
}

class BufferDiv extends React.Component {

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
    let editor = CKEDITOR.instances.postTextarea;
    let selection = editor.getSelection();
    let range = selection.getRanges()[0];
    let text = range.startContainer.getText();


    //var text = e.target.value;
    //this.setState({bodyText: text});

    //var $text_area = $('#postTextarea');
    var caretCursorPos = range.startOffset;
    //var caretPixelPos = $text_area.textareaHelper('caretPos');

    var dummyElement = editor.document.createElement( 'img', {
       attributes :
       {
          src : 'null',
          width : 0,
          height : 0
       }
    });

    editor.insertElement( dummyElement );

    // var x = 0;
    // var y  = 0;
    //
    // var obj = dummyElement.$;
    //
    // while (obj.offsetParent){
    //    x += obj.offsetLeft;
    //    y  += obj.offsetTop;
    //    obj    = obj.offsetParent;
    // }
    // x += obj.offsetLeft;
    // y  += obj.offsetTop;

    //window.parent.document.title = "top: " + y + ", left: " + x;

    let boundingRect = dummyElement.$.getBoundingClientRect();

    let xCaretPixelPos = boundingRect.left;
    let yCaretPixelPos = boundingRect.top + parent.frames[0].frameElement.offsetTop;


    // let x = boundingRect.left;
    // let y = boundingRect.right;

    dummyElement.remove();

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
      var top = yCaretPixelPos.toString() + 'px';
      //var left = (caretPixelPos.left + 5).toString() + 'px';
      var left = xCaretPixelPos.toString() + 'px';
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

  componentDidMount(e) {
    console.log('****mounted!');
    console.log(React.findDOMNode);
    let el = React.findDOMNode(this);
    console.log(el);
    let x = 0;
    console.log(CKEDITOR);
    let that = this;
    CKEDITOR.replace('postTextarea', {
      on: {
        contentDom: function() {
          this.document.on( 'mouseup', function(e) {
              console.log('mouseup');
              console.log(e);

              //moveOutOfKeyword(e);
          } );
          this.document.on( 'keyup', that.handleKeyStroke);
        }
      }
      });
    // el.getElementsByTagName('textarea')[0]
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
