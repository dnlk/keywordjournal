
import React from "react";

import {analyzeCurrentWord} from "postparser.js";

const TextBoxID = 'postTextarea';


export class TextEditor extends React.Component {

  constructor(props) {
    super();

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
    this.key = this.key.bind(this);
    this.createPartialKeyword = this.createPartialKeyword.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
  }

  key(e) {

    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
      e.preventDefault();
      return;
    }

    let editor = CKEDITOR.instances.postTextarea;
    let selection = editor.getSelection();
    let range = selection.getRanges()[0];

    let parentNode = range.startContainer.getParent();
    if (!parentNode.hasClass('kwj-keyword')) {
      return;
    }

    if (range.startOffset === 0) {
      range.moveToPosition(parentNode, CKEDITOR.POSITION_BEFORE_START);
    }
    else {
      range.moveToPosition(parentNode, CKEDITOR.POSITION_AFTER_END);
    }

    range.select();
  }

  createPartialKeyword(range) {

    let editor = CKEDITOR.instances.postTextarea;
    let parentNode = range.startContainer.getParent();
    let text = parentNode.getText();
    parentNode.setText('');

    let startText = text.slice(0, range.startOffset - 1);
    let endText = text.slice(range.startOffset);

    editor.insertText(startText);

    // parentNode.setText(text.slice(0, -1));  // All but last char
    let html_to_insert = '<span class="kwj-keyword-partial">#</span>';
    editor.insertHtml(html_to_insert);

    if (endText.length > 0) {
      range.moveToPosition(parentNode, CKEDITOR.POSITION_BEFORE_END);
      range.select();

      editor.insertText(endText);
    }
  }

  handleKeyStroke(e) {

    let editor = CKEDITOR.instances.postTextarea;
    let selection = editor.getSelection();
    let range = selection.getRanges()[0];

    let parentNode = range.startContainer.getParent();

    let text = parentNode.getText();


    if (!parentNode.hasClass('kwj-keyword-partial')) {
      // This block will handle resetting currentWord when the kwj-keyword-partial span is deleted. The awkwardness
      // is due to the way that keyup is double firing, once for the inner text container, and once for the
      // kwj-keyword-partial span.
      if (!(range.startContainer.hasClass === undefined) && !range.startContainer.hasClass('kwj-keyword-partial')) {
        this.props.updateCurrentWord({});

        return;
      }

      if (range.startContainer.hasClass === undefined) {

        this.props.updateCurrentWord({});

        if (text.length > 0 && text[range.startOffset - 1] === '#') {  // Last char in text
          this.createPartialKeyword(range);
        }

        return;
      }

    }




    let caretCursorPos = range.startOffset;

    let dummyElement = editor.document.createElement( 'img', {
       attributes :
       {
          src : 'null',
          width : 0,
          height : 0
       }
    });

    editor.removeListener('change', this.handleKeyStroke);

    editor.insertElement( dummyElement );

    // Alternate approach: http://ckeditor.com/forums/CKEditor-3.x/Cursor-coordinates-XY-SOLVED
    let boundingRect = dummyElement.$.getBoundingClientRect();

    let xCaretPixelPos = boundingRect.left;
    let yCaretPixelPos = boundingRect.top + parent.frames[0].frameElement.offsetTop;


    dummyElement.remove();

    editor.on('change', this.handleKeyStroke);

    let currentWordAnalysis = analyzeCurrentWord(text, caretCursorPos);
    currentWordAnalysis.range = range;

    console.log('current word:', currentWordAnalysis);

    this.props.updateCaretPos({x: xCaretPixelPos, y: yCaretPixelPos});
    this.props.updateCurrentWord(currentWordAnalysis);

  }

  setKeyword(currentKeyword, clickedKeyword, args) {
    let parentNode = currentKeyword.range.startContainer.getParent();
    parentNode.removeClass('kwj-keyword-partial');
    parentNode.addClass('kwj-keyword');

    let json_args = JSON.stringify(args);
    parentNode.setAttributes({
      'kwj-args': json_args
    });

    parentNode.setText(clickedKeyword.keyword);

    let editor = CKEDITOR.instances.postTextarea;
    let selection = editor.getSelection();
    let range = selection.getRanges()[0];
    range.moveToPosition(parentNode, CKEDITOR.POSITION_AFTER_END);
    range.select();
    editor.insertText(' ');
  }

  componentDidMount(e) {
    let that = this;
    let css = `
      .kwj-keyword {
        border: 1px solid blue;
      }
      .kwj-keyword-partial {
        border: 1px solid red;
      }
    `;
    CKEDITOR.addCss(css);

    let editor = CKEDITOR.replace(TextBoxID, {
      allowedContent: true,
      on: {
        contentDom: function() {
          this.document.$.addEventListener( 'keydown', that.key);
        }
      }
    });

    editor.on('change', this.handleKeyStroke);

    this.props.registerSetKeywordInEditor(this.setKeyword);
  }

  render() {
    return (
      <textarea
        id={TextBoxID}
        name="post_body"
        cols="100" rows="15"
        placeholder="Post body here"
      />
    )
  }
}

