import * as gap_buffer from 'gap_buffer';
import {newBuffer} from 'gap_buffer';


let BUFFER_SIZE = 2 ** 16;
let TYPES = {
    char : 0,
    keyword : 1,
};


function isSpaceOrNewline(char) {
    return char === ' ' || char === '\n';
}


export class CharacterBuffer {
    /*
    data
    idx
    type
     */

    constructor(props) {
        props = props || {};
        this.buffer = gap_buffer.newBuffer(BUFFER_SIZE);
        this.keywordLeftWrapper = props.keywordLeftWrapper || '';
        this.keywordRightWrapper = props.keywordRightWrapper || '';
    }

    addCharacter(char) {
        let data = {
            data : char,
            idx : this.buffer.gapStart,
            type : TYPES.char,
        };
        gap_buffer.writeToBuffer(this.buffer, data);
    }

    addKeyWord(keyWord) {
        let data = {
            data : keyWord,
            idx : this.buffer.gapStart,
            type : TYPES.keyword,
        };
        gap_buffer.writeToBuffer(this.buffer, data);
    }

    deleteCurrent() {
        if (this.buffer.gapStart > 0) {
            this.buffer.gapStart -= 1;
        }
    }

    moveCursor(n) {
        gap_buffer.moveCursor(this.buffer, n);
    }

    currentWord() {
        let startIdx = gap_buffer.walkUntil(this.buffer, this.buffer.gapStart - 1, -1, isSpaceOrNewline);
        let endIdx = gap_buffer.walkUntil(this.buffer, this.buffer.gapEnd - 1, 1, isSpaceOrNewline());
        let enclosingWord = text.slice(startIdx, endIdx);
        return {
            startIdx: startIdx,
            enclosingWord: enclosingWord
        };
    }

    getCursorPos() {
        return this.buffer.gapStart;
    }

    numCharsBeforeCurs() {
        return this.buffer.gapStart;
    }

    numCharsAfterCurs() {
        return this.buffer.size - this.buffer.gapEnd;
    }

    numChars() {
        return this.numCharsAfterCurs() + this.numCharsBeforeCurs();
    }

    getText(beginIdx, endIdx) {
        let chars = [];
        for (let i = beginIdx; i < endIdx; i++) {
            let data = this.buffer.buffer[i];
            if (data.type === TYPES.keyword) {
                chars.push(this.keywordLeftWrapper + data.data + this.keywordRightWrapper);
            }
            else {
                chars.push(this.buffer.buffer[i].data);
            }
        }
        return chars.join('');
    }

    getTextBefore() {
        return this.getText(0, this.buffer.gapStart);
    }

    getTextAfter() {
        return this.getText(this.buffer.gapEnd, this.buffer.size);
    }

    getAllText() {
        return this.getTextBefore() + this.getTextAfter();
    }
}

