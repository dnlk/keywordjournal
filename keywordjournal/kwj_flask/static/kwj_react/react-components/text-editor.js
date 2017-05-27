
import React from "react";

import {analyzeCurrentWord} from "postparser.js";

const TextBoxID = 'postTextarea';


export class TextEditor extends React.Component {

  constructor(props) {
    super();

    this.handleKeyStroke = this.handleKeyStroke.bind(this);
  }

  handleKeyStroke(e) {
    let editor = CKEDITOR.instances.postTextarea;
    let selection = editor.getSelection();
    let range = selection.getRanges()[0];
    let text = range.startContainer.getText();

    let caretCursorPos = range.startOffset;

    let dummyElement = editor.document.createElement( 'img', {
       attributes :
       {
          src : 'null',
          width : 0,
          height : 0
       }
    });

    editor.insertElement( dummyElement );

    // Alternate approach: http://ckeditor.com/forums/CKEditor-3.x/Cursor-coordinates-XY-SOLVED
    let boundingRect = dummyElement.$.getBoundingClientRect();

    let xCaretPixelPos = boundingRect.left;
    let yCaretPixelPos = boundingRect.top + parent.frames[0].frameElement.offsetTop;


    dummyElement.remove();

    let currentWordAnalysis = analyzeCurrentWord(text, caretCursorPos);
    console.log(currentWordAnalysis);

    this.props.updateCaretPos({x: xCaretPixelPos, y: yCaretPixelPos});
    this.props.updateCurrentWord(currentWordAnalysis);

  }

  componentDidMount(e) {
    let that = this;
    CKEDITOR.replace(TextBoxID, {
      on: {
        contentDom: function() {
          this.document.on( 'mouseup', function(e) {

          } );
          this.document.on( 'keyup', that.handleKeyStroke);
        }
      }
    });
  }

  render() {
    return (
      <textarea
        id={TextBoxID}
        name="post_body"
        cols="100" rows="15"
        placeholder="Post body here"
        onChange={this.handleKeyStroke}
      />
    )
  }
}

