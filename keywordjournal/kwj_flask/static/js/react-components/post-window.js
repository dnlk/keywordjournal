import React from "react";
import jQuery from "jquery";

import "textarea-helper";

import {KeyWordSelectionWindow} from "react-components/keyword-selection-window.js"

export class PostWindow extends React.Component {
  render() {
    return (
      <form className="postWindow">
        <HeaderWindow />
        <br />
        <BodyWindow />
        <br />
        <SubmitPost />
        <p>Hello World!</p>
      </form>
    );
  }
};

class HeaderWindow extends React.Component {
  render() {
    return (
      <div className="headerWindow">
        <input type="text" placeholder="Title here" name="post_title" />
      </div>
    )
  }
}

class BodyWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({bodyText: 'foo'});

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
  }

  handleKeyStroke(e) {
    this.setState({bodyText: e.target.value});
    console.log(e);
    console.log(e.target);
    var $text_area = $('#postTextarea');
    var caretPos = $text_area.textareaHelper('caretPos');
    var top = caretPos.top.toString() + 'px';
    var left = (caretPos.left + 5).toString() + 'px';
    var selectionWindowEl = document.getElementById("keyWordSelectionWindow");
    selectionWindowEl.style.top = top;
    selectionWindowEl.style.left = left;
  }

  render() {
    return (
      <div className="bodyWindow">
        <textarea
          id="postTextarea"
          name="post_body"
          cols="100" rows="15"
          placeholder="Post body here"
          onChange={this.handleKeyStroke}
        />
        <KeyWordSelectionWindow
          currentText={this.state.bodyText}
        />
      </div>
    );
  }
};

class SubmitPost extends React.Component {
  render() {
    return (
      <input type="submit" className="submitPost" value="Submit Post" />
    );
  }
}
