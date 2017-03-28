
import * as kwj_buffer from 'kwj_buffer'
import {run_tests} from 'tests/test_runner'
import * as assert from 'assert'


function testThatNewBufferIsEmpty() {
    let buffer = new kwj_buffer.CharacterBuffer();
    assert.equal(buffer.getTextBefore(), '');
    assert.equal(buffer.getTextAfter(), '');
}

function testAddingSingleChar() {
    let buffer = new kwj_buffer.CharacterBuffer();
    const char = 'x';
    buffer.addCharacter(char);
    assert.equal(buffer.getTextBefore(), char);
    assert.equal(buffer.getTextAfter(), '');
}

run_tests([
    testThatNewBufferIsEmpty,
    testAddingSingleChar
]);
