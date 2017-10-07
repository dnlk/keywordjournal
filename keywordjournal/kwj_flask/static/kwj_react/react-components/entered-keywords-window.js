import React from "react";


function makeKeyword(i, keyword, that) {
    let key = keyword.key.toString();
    return (
        <li key={key} onClick={function(a, b){that.keywordClicked(a, b, key)}}>
            {keyword.keyword}
        </li>
    )
}

function makeEnteredKeyword(keyword, index, onClickCallback) {
  let args = keyword.args;
  let argsDisplayList = [];

  for (const argName of Object.keys(args)) {
    let argValue = args[argName];
    argsDisplayList.push(argName + ' : ' + argValue)
  }

  let argsDisplay =  keyword.keyword + ' - ' + argsDisplayList.join(' , ');

  return (
    <li onClick={_ => onClickCallback(index)}>
      {argsDisplay}
    </li>
  )
}


export class EnteredKeywords extends React.Component {

  render() {
    let cb = this.props.enteredKeywordClicked;
    let enteredKeywords = this.props.enteredKeywords.map((kw, i) => makeEnteredKeyword(kw, i, cb));

    return (
      <div>
        Entered Keywords:
        <ul id="entered-keywords">
          {enteredKeywords}
        </ul>
      </div>
    );
  }
}


export class SelectKeyword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestedWords: [],
      currentWord: '',
    };


    this.updateCurrentWord = this.updateCurrentWord.bind(this);
  }

  updateCurrentWord(e) {
    this.setState({
      currentWord: e.target.value,
    });
  }

  keywordClicked(a, b, key) {
    let clickedKeyword = this.props.availableKeywords.find(keyword => keyword.key.toString() === key);
    this.props.keywordSelected(clickedKeyword);
  }

  render() {

    let suggestedWords_raw = this.props.availableKeywords.filter(k => k.keyword.startsWith(this.state.currentWord));

    let newKeywordButton;
    let keywordTextValues = this.props.availableKeywords.map(k => k.keyword);
    if (!this.state.currentWord || keywordTextValues.includes(this.state.currentWord)) {
        newKeywordButton = (
            <div></div>
        );
    }
    else {
      let callback = function(e, rid) {
          this.props.createKeyword(this.state.currentWord);
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

    let words = [];
    let that = this;
    for (let i in suggestedWords_raw) {
      words.push(
          makeKeyword(i, suggestedWords_raw[i], that)
      );
    }

    return (

      <div id="select-keyword">
        Select Keyword
        <input
          type="text"
          onChange={this.updateCurrentWord}
        />
        <ul>
          {words}
        </ul>
        {newKeywordButton}
      </div>
    )
  }
}