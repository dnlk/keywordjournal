import React from "react";

export class KeyWordSelectionWindow extends React.Component {
  render() {
    var currentWord = this.props.currentWord;
    var matchingKeywords = this.props.matchingKeywords;

    console.log('matching keywords');
    console.log(matchingKeywords);

    var words = [];
    for (var word in matchingKeywords) {
      words.push(
          <li onClick={this.props.keywordClicked}>
            {matchingKeywords[word]}
          </li>
      );
      console.log(word);
      console.log('words in');
      console.log(words);
    }

    console.log('words outer');
    console.log(words);
    
    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow">
        <ul>
          {words}
        </ul>
      </div>
    );
  }
};
