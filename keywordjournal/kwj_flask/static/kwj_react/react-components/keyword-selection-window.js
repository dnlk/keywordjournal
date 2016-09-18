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
    var that = this;
    for (var i in matchingKeywords) {
      //var key = i.toString();
      words.push(
          makeKeyword(i, matchingKeywords[i], that)
      );
    }

    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow">
        <ul>
          {words}
        </ul>
      </div>
    );
  }
};
