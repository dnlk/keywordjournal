import React from "react";

import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";
import {KeywordArgsWindow, NewArg} from "react-components/keyword-args-window";

function makeKeyword(i, keyword, that) {
    let key = keyword.key.toString();
    return (
        <li key={key} onClick={function(a, b){that.keywordClicked(a, b, key)}}>
            {keyword.keyword}
        </li>
    )
}

export class KeyWordSelectionWindow extends React.Component {

  constructor(props) {

      super();

      this.renderIfKeyword = this.renderIfKeyword.bind(this);
      this.keywordClicked = this.keywordClicked.bind(this);
      this.newKeyword = this.newKeyword.bind(this);
  }

  newKeyword(keywordText) {
      let newKeyword = {
        keyword: keywordText,
        args: [],
        key: this.props.availableKeywords.length
      };

      $.ajax({
        url: '/api/new_keyword',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            keyword: keywordText,
        }),
        success: function() {
            this.props.availableKeywords.push(newKeyword);
            this.forceUpdate();
        }.bind(this)
      });
  }

  keywordClicked(a, b, key) {
    let clickedKeyword = this.props.availableKeywords.find(keyword => keyword.key.toString() === key);
    this.props.keywordClicked(a, b, clickedKeyword);
  }

  renderIfKeyword() {

    let currentWord = this.props.currentWord;
    let currentKeyWordText = currentWord.enclosingWord.slice(1);
    let matchingKeywords = getMatchingKeywords(currentKeyWordText, this.props.availableKeywords);

    let words = [];
    let raw_keywords = [];
    let that = this;
    for (let i in matchingKeywords) {
      words.push(
          makeKeyword(i, matchingKeywords[i], that)
      );
      raw_keywords.push(matchingKeywords[i].keyword);
    }

    console.log(currentKeyWordText);
    console.log(raw_keywords);
    console.log(words);

    let newKeywordButton;
    if (raw_keywords.includes(currentKeyWordText)) {
        console.log('TRRRRUUUUE');
        newKeywordButton = (
            <div></div>
        );
    }
    else {
        let callback = function(e, rid) {
            this.newKeyword(currentKeyWordText);
        }.bind(this);
        newKeywordButton = (
            <button
                type="button"
                onClick={callback}
            >
                Create Keyword
            </button>
        );
    }


    let top = this.props.caretPos.y.toString() + 'px';
    let left = this.props.caretPos.x.toString() + 'px';

    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow" style={{top: top, left:left}}>
        <ul>
          {words}
        </ul>
          {newKeywordButton}
      </div>
    );

  }

  renderIfNotKeyword() {
      return (
          <div></div>
      )
  }

  render() {
    let currentWord = this.props.currentWord;

    if (currentWord.isTag) {
        return this.renderIfKeyword();
    }
    else {
        return this.renderIfNotKeyword();
    }
  }
}
