import React from "react";

function makeKeyword(i, keyword, that) {
    var key = keyword.key.toString();
    return (
        <li key={key} onClick={function(a, b){that.props.keywordClicked(a, b, key)}}>
            {keyword.keyword}
        </li>
    )
}

export class KeyWordSelectionWindow extends React.Component {
  render() {
    var currentWord = this.props.currentWord;
    var matchingKeywords = this.props.matchingKeywords;

    var words = [];
    var raw_keywords = [];
    var that = this;
    for (var i in matchingKeywords) {
      //var key = i.toString();
      words.push(
          makeKeyword(i, matchingKeywords[i], that)
      );
      raw_keywords.push(matchingKeywords[i].keyword);
    }

    console.log(currentWord.slice(1));
    console.log(raw_keywords);
      
    // if (currentWord.slice(1) in raw_keywords) {
    if (raw_keywords.includes(currentWord.slice(1))) {
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

    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow">
        <ul>
          {words}
        </ul>
          {new_keyword_button}
      </div>
    );
  }
};
