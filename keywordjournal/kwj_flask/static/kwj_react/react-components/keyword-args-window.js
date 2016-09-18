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
            args.push(
                <li key="{i.toString()}">
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
                <button type="button">Create new argument</button>
            </div>
        )
    }
}