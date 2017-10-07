import React from "react";
import jQuery from "jquery";  // This is needed. Maybe for the text editor (CKEDITOR)

import {analyzeCurrentWord} from "postparser.js";
import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";
import {KeywordArgsWindow, NewArg} from "react-components/keyword-args-window";
import {TextEditor} from "react-components/text-editor.js";
import {EnteredKeywords, SelectKeyword} from "react-components/entered-keywords-window.js";

export class PostWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredKeywords: [],
      availableKeywords: [],
      clickedKeyword: undefined,
      currentWord: undefined,
    };

    $.ajax({
      url: '/api/tags_and_args',
      method: 'GET',
      dataType: 'json',
      success: function(json_data, status, jqXHR) {
        this.setState({availableKeywords: json_data.data})
      }.bind(this),
    });

    this.keywordSelected = this.keywordSelected.bind(this);
    this.createKeyword = this.createKeyword.bind(this);
    this.finishedWithArgs = this.finishedWithArgs.bind(this);
    this.finishedWithEditingArgs = this.finishedWithEditingArgs.bind(this);
    this.keywordReSelected = this.keywordReSelected.bind(this);
    this.removeEnteredKeyword = this.removeEnteredKeyword.bind(this);

  }

  createKeyword(keywordText) {
    let newKeyword = {
      keyword: keywordText,
      args: [],
      key: this.state.availableKeywords.length
    };

    $.ajax({
      url: '/api/new_keyword',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          keyword: keywordText,
      }),
      success: function() {
          this.state.availableKeywords.push(newKeyword);
          this.forceUpdate();
      }.bind(this)
    });
  }

  keywordSelected(keyWord) {
    this.setState({
      clickedKeyword: keyWord,
    });
  }

  keywordReSelected(index) {
    let enteredKeyword = this.state.enteredKeywords[index];
    let keyword = this.state.availableKeywords.find(kw => kw.keyword === enteredKeyword.keyword);
    this.setState({
      clickedKeywordEntered: keyword,
      clickedKeywordEnteredEntry: enteredKeyword,
      clickedKeywordEnteredArgs: enteredKeyword.args,
      clickedKeywordEnteredIndex: index,
    })
  }

  finishedWithArgs(args) {
    let keyword = this.state.clickedKeyword.keyword;
    let enteredKeywords = this.state.enteredKeywords;
    enteredKeywords.push({keyword: keyword, args: args});
    this.setState({
      clickedKeyword: undefined,
      currentWord: undefined,
    });
  }

  finishedWithEditingArgs(args) {
    let keywordEnteredEntry = this.state.clickedKeywordEnteredEntry;
    keywordEnteredEntry.args = args;
    this.setState({
      clickedKeywordEntered: undefined,
      clickedKeywordEnteredArgs: undefined,
      clickedKeywordEnteredEntry: undefined,
      clickedKeywordEnteredIndex: undefined,
    });
  }

  removeEnteredKeyword() {
    let index = this.state.clickedKeywordEnteredIndex;
    if (index !== undefined && index !== -1) {
      this.state.enteredKeywords.splice(index, 1  );
    }
    this.setState({
      clickedKeyword: undefined,
      currentWord: undefined,

      clickedKeywordEntered: undefined,
      clickedKeywordEnteredArgs: undefined,
      clickedKeywordEnteredEntry: undefined,
      clickedKeywordEnteredIndex: undefined,
    })
  }

  render() {
    let enteredKeywordsJson = JSON.stringify(this.state.enteredKeywords);
    return (
      <form method="post" action="api/post" className="postWindow">
        <EnteredKeywords
          enteredKeywords={this.state.enteredKeywords}
          enteredKeywordClicked={this.keywordReSelected}
        />
        <input type="hidden" id="entered-keywords-json" name="entered_keywords" value={enteredKeywordsJson}/>
        <br />
        <SelectKeyword
          availableKeywords={this.state.availableKeywords}
          keywordSelected={this.keywordSelected}
          createKeyword={this.createKeyword}
        />
        <KeywordArgsWindow
           keyword={this.state.clickedKeyword}
           finishedWithArgs={this.finishedWithArgs}
           removeEnteredKeyword={this.removeEnteredKeyword}
        />
        <KeywordArgsWindow
           keyword={this.state.clickedKeywordEntered}
           defaultArgValues={this.state.clickedKeywordEnteredArgs}
           finishedWithArgs={this.finishedWithEditingArgs}
           removeEnteredKeyword={this.removeEnteredKeyword}
        />
        <br />
        <HeaderWindow />
        <br />
        <BodyWindow />
        <br />
        <SubmitPost />
        <h3>Previous Posts</h3>
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
      caretPos: {x: 0, y: 0},
    });

    this.updateCaretPos = this.updateCaretPos.bind(this);
  }

  updateCaretPos(caretPos) {
    this.setState({caretPos: caretPos});
  }

  render() {
    return (
      <div className="bodyWindow">
        <TextEditor
          updateCurrentWord={this.updateCurrentWord}
          updateCaretPos={this.updateCaretPos}
          registerSetKeywordInEditor = {this.registerSetKeywordInEditor}
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
