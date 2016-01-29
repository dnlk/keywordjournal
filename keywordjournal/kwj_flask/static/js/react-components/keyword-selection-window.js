import React from "react";

export class KeyWordSelectionWindow extends React.Component {
  render() {
    var currentText = this.props.currentText;
    console.log('render SelectionWindow');
    console.log(currentText);

    var textLength = currentText.length;
    var startIndex = Math.max(textLength - 5, 0);
    var endIndex = textLength;
    var subString = currentText.slice(startIndex, endIndex);
    console.log(subString);
    return (
      <div className="keyWordSelectionWindow" id="keyWordSelectionWindow">
        <p>{subString}</p>
      </div>
    );
  }
};
