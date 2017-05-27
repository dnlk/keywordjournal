import React from "react";

import {getMatchingKeywords, getAvailableKeywords} from "keyword.js";

function makeKeyword(i, keyword, that) {
    let key = keyword.key.toString();
    return (
        <li key={key} onClick={function(a, b){that.props.keywordClicked(a, b, key)}}>
            {keyword.keyword}
        </li>
    )
}

export class KeyWordSelectionWindow extends React.Component {

  constructor(props) {

      super();

      this.state = {
          availableKeywords: getAvailableKeywords()
      };

      this.renderIfKeyword = this.renderIfKeyword.bind(this);
  }


  renderIfKeyword() {

    let currentWord = this.props.currentWord;
    let currentKeyWordText = currentWord.enclosingWord.slice(1);
    let matchingKeywords = getMatchingKeywords(currentKeyWordText, this.state.availableKeywords);

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

    if (raw_keywords.includes(currentKeyWordText)) {
        console.log('TRRRRUUUUE');
        var new_keyword_button = (
            <div></div>
        );
    }
    else {
        var new_keyword_button = (
            <button type="button">Create Keyword</button>
        );
    }


    let top = this.props.caretPos.y.toString() + 'px';
    let left = this.props.caretPos.x.toString() + 'px';

    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow" style={{top: top, left:left}}>
        <ul>
          {words}
        </ul>
          {new_keyword_button}
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
