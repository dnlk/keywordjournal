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
        let argName = newArgNameInput.value;
        let argType = newArgTypeInput.value;
        let keyword = this.props.keyword.keyword;

        $.ajax({
          url: '/api/new_keyword_args',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
              name: argName,
              type: argType,
              keyword: keyword,
          }),
          success: function() {
            this.props.keyword.args.push({
              name: argName,
              type: argType || "string",
              keyword: keyword,
            });
            this.forceUpdate();
          }.bind(this)
        });
    }

    finishedWithArgs(e, rid) {
        var $parent = $(e.currentTarget).parent();
        var $lis = $parent.find('li');

        let args = {};

        for (var i = 0; i < $lis.length; i++) {
          let $li = $($lis[i]);
          let name = $li.text();
          let value = $li.find('input').val();
          let keywordType = $li.find('input').attr('placeholder');

          // See https://stackoverflow.com/questions/12467542/how-can-i-check-if-a-string-is-a-float for source
          // of regex
          if (keywordType === 'int') {
            let intRegex = /^-?\d+$/;
            if (!intRegex.test(value) && value != '') {
              alert('Bad type!');
              return;
            }
          }
          if (keywordType === 'float') {
            let floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
            if (!floatRegex.test(value) && value != '') {
                alert('Bad type!');
                return;
            }
          }

          args[name] = value;

          $li.textContent = '';
          $li.find('input').val('');


        }

        this.props.finishedWithArgs(args);

    }

    renderIfNotKeywordClicked() {
        return (
            <div></div>
        );
    }

    renderIfKeywordClicked() {
        let keyword = this.props.keyword || {};
        let keywordArgs = keyword.args || [];
        let defaultArgValues = this.props.defaultArgValues || {};

        let args = [];

        for (var i in keywordArgs) {
            let key = i.toString();
            let defaultValue = defaultArgValues[keywordArgs[i].name] || '';
            args.push(
                <li key={key}>
                    {keyword.args[i].name}
                    <input type="text" placeholder={keyword.args[i].type} defaultValue={defaultValue} />
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