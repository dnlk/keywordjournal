/**
 * Created by Dan on 9/18/2016.
 */

import React from "react";

let NEW_ARG_NAME_ID = "new-arg-name";
let NEW_ARG_TYPE_ID = "new-arg-type";

export class KeywordArgsWindow extends React.Component {

    constructor(props) {
        super();

        this.renderIfKeywordClicked = this.renderIfKeywordClicked.bind(this);
        this.renderIfNotKeywordClicked = this.renderIfNotKeywordClicked.bind(this);
        this.finishedWithArgs = this.finishedWithArgs.bind(this);
        this.newArgClicked = this.newArgClicked.bind(this);

    }

    newArgClicked(e, rid) {
        let newArgNameInput = document.getElementById(NEW_ARG_NAME_ID);
        let newArgTypeInput = document.getElementById(NEW_ARG_TYPE_ID);

        this.props.keyword.args.push({
            name: newArgNameInput.value,
            type: newArgTypeInput.value || "string",
        });

        this.forceUpdate();
    }

    finishedWithArgs(e, rid) {
        var $parent = $(e.currentTarget).parent();
        var $lis = $parent.find('li');

        // var args = [];

        let args = {};

        for (var i = 0; i < $lis.length; i++) {
          let $li = $($lis[i]);
          let name = $li.text();
          let value = $li.find('input').val();

          args[name] = value;

          $li.textContent = '';
          $li.find('input').val('');
        }

        this.props.finishedWithArgs(args);

        // var jsonArgs = JSON.stringify(args);
        //
        // var currentWord = this.state.currentWord;
        // var caretCursorPos = this.state.caretCursorPos;
        // var currentText = this.state.bodyText;
        // var clickedKeyword = this.state.clickedKeyword;
        //
        // console.log('currentWord', currentWord);
        // console.log('caretCursorPos', caretCursorPos);
        // console.log('currentText', currentText);
        // console.log('clickedKeyword', clickedKeyword);
        //
        // var newText = currentText.substring(0, caretCursorPos - currentWord.length + 1) +
        //     clickedKeyword.keyword + '<' + jsonArgs + '>' +
        //     currentText.substring(caretCursorPos);
        //
        // this.setState({
        //   bodyText: newText,
        // });
        //
        // $('#postTextarea').val(newText);
        //
        // document.getElementById("keywordArgsWindow").style.visibility = 'hidden';
        // document.getElementById("keywordArgsWindow").style.visibility = 'hidden';
        // $('#postTextarea').focus();
    }

    renderIfNotKeywordClicked() {
        return (
            <div></div>
        );
    }

    renderIfKeywordClicked() {
        let keyword = this.props.keyword || {};
        let keywordArgs = keyword.args || [];

        let args = [];

        for (var i in keywordArgs) {
            let key = i.toString();
            args.push(
                <li key={key}>
                    {keyword.args[i].name}
                    <input type="text" />
                </li>
            );
        }

        let style = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            'background-color': 'white',
        };

        return (
            <div className="keywordArgsWindow" id="keywordArgsWindow" style={style}>
                <h3>{keyword.keyword}</h3>
                <ul>
                    {args}
                </ul>
                <button type="button" onClick={this.newArgClicked}>Create new argument</button>
                <input id={NEW_ARG_NAME_ID} type="text" name="argName" placeholder="new arg name"/>
                <input id={NEW_ARG_TYPE_ID} type="text" name="argType" placeholder="string"/>
                <br />
                <button type="button" onClick={this.finishedWithArgs}>Done</button>
            </div>
        );
    }

    render() {
        if (this.props.keyword === undefined) {
          return this.renderIfNotKeywordClicked();
        }
        else {
          return this.renderIfKeywordClicked();
        }
    }
}
export class NewArg extends React.Component {


    render() {

        return (
            <div id="newArg">
                <h4>Create new keyword</h4>
                <p>Arg Name</p>
                <input id="arg-name" type="text" name="arg-name" />
                <p>Arg Type</p>
                <select id="arg-type" name="arg-type">
                    <option value="number">Number</option>
                    <option value="string">String</option>
                </select>
                <button type="button" onClick={this.props.newArgSubmit}>Create Arg</button>
            </div>
        );

    }

}