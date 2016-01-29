import React from "react";

export class KeyWordSelectionWindow extends React.Component {
  render() {
    var currentWord = this.props.currentWord;
    
    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow">
        <p>{currentWord}</p>
      </div>
    );
  }
};
