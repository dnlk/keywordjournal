import * as gap_buffer from 'gap_buffer';
import {newBuffer} from 'gap_buffer';


BUFFER_SIZE = 2 ** 16;
var TYPES = {
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
        this.buffer = gap_buffer.newBuffer(BUFFER_SIZE);
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
        let data = this.buffer.buffer[this.buffer.gapStart];
        if (data.type === TYPES.char) {
            this.buffer.gapStart = Math.min(0, this.buffer.gapStart -1);
        }
        else if (data.type === TYPES.keyword) {

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
}
