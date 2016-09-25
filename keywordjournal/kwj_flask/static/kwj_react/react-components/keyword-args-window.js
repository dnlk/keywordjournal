/**
 * Created by Dan on 9/18/2016.
 */

import React from "react";

export class KeywordArgsWindow extends React.Component {

    render() {

        var keyword = this.props.keyword || {};
        var keywordArgs = keyword.args || [];

        var args = [];

        for (var i in keywordArgs) {
            var key = i.toString();
            args.push(
                <li key={key}>
                    {keyword.args[i].name}
                    <input type="text" />
                </li>
            )
        }

        return (
            <div className="keywordArgsWindow" id="keywordArgsWindow">
                <h3>{keyword.keyword}</h3>
                <ul>
                    {args}
                </ul>
                <button type="button" onClick={this.props.newArgClicked}>Create new argument</button>
                <br />
                <button type="button" onClick={this.props.finishedWithArgs}>Done</button>
            </div>
        );
    }
}

export class NewKeyword extends React.Component {

    render() {

        return (
            <div id="newKeyword">
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