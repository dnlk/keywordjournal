
import * as kwj_buffer from 'kwj_buffer'
import {run_tests} from 'tests/test_runner'
import * as assert from 'assert'


function testThatNewBufferIsEmpty() {
    let buffer = new kwj_buffer.CharacterBuffer();
    assert.equal(buffer.getTextBefore(), '');
    assert.equal(buffer.getTextAfter(), '');
}

function testAddingTwoChars() {
    let buffer = new kwj_buffer.CharacterBuffer();
    const char1 = 'x';
    const char2 = 'y';
    buffer.addCharacter(char1);
    buffer.addCharacter(char2);
    assert.equal(buffer.getTextBefore(), char1 + char2);
    assert.equal(buffer.getTextAfter(), '');
}

function testDeleteCharFromEnd() {
    let buffer = new kwj_buffer.CharacterBuffer();
    let str = 'abcdef';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });

    buffer.deleteCurrent();
    assert.equal(buffer.buffer.gapStart, 5);
    assert.equal(buffer.getTextBefore(), 'abcde');
}

function testDeleteCharFromMiddle() {
    let buffer = new kwj_buffer.CharacterBuffer();
    let str = 'abcdef';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });

    buffer.moveCursor(3);
    buffer.deleteCurrent();
    assert.equal(buffer.getTextBefore(), 'ab');
    assert.equal(buffer.getTextAfter(), 'def');
}

function testDeleteFromBeginning() {
    let buffer = new kwj_buffer.CharacterBuffer();

    buffer.deleteCurrent();
    assert.equal(buffer.getCursorPos(), 0);
}

function testMoveCursor() {
    let buffer = new kwj_buffer.CharacterBuffer();
    let str = 'abcdef';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });

    buffer.moveCursor(0);
    assert.equal(buffer.buffer.gapStart, 0);
    assert.equal(buffer.buffer.gapEnd, buffer.buffer.size - str.length);
    assert.equal(buffer.getText(buffer.buffer.size - str.length, buffer.buffer.size), 'abcdef');

    buffer.moveCursor(3);
    buffer.deleteCurrent();
    buffer.addCharacter('x');
    assert.equal(buffer.buffer.gapStart, 3);
    assert.equal(buffer.buffer.gapEnd, buffer.buffer.size - 3);
    assert.equal(buffer.getText(0, 3), 'abx');


}

function testCursorPos() {
    let buffer = new kwj_buffer.CharacterBuffer();
    let str = 'abcdef';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });

    assert.equal(buffer.getCursorPos(), 6);

    buffer.moveCursor(2);
    assert.equal(buffer.getCursorPos(), 2);

    buffer.moveCursor(0);
    assert.equal(buffer.getCursorPos(), 0);
}

function testMovingCursorBeforeStartOfBuffer() {

}

function testMovingCursorAfterEndOfBuffer() {

}

function overflowBuffer() {

}

function testAddWord() {
    let buffer = new kwj_buffer.CharacterBuffer({
        keywordLeftWrapper: '[',
        keywordRightWrapper: ']'
    });
    let str = 'abcdef';
    let word = 'word';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });
    buffer.addKeyWord('word');

    assert.equal(buffer.getAllText(), str + '[' + word + ']');
}

function testDeleteWord() {
    let buffer = new kwj_buffer.CharacterBuffer();
    let str = 'abcdef';
    let word = 'word';
    str.split('').forEach(function(c){
        buffer.addCharacter(c);
    });
    buffer.addKeyWord('word');

    buffer.deleteCurrent();
    assert.equal(buffer.getAllText(), str);
}

run_tests([
    testThatNewBufferIsEmpty,
    testAddingTwoChars,
    testDeleteCharFromEnd,
    testDeleteCharFromMiddle,
    testDeleteFromBeginning,
    testMoveCursor,
    testCursorPos,
    testAddWord,
    testDeleteWord
]);
