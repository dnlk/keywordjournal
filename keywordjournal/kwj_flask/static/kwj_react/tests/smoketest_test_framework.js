
import {run_tests} from 'tests/test_runner'
import * as assert from 'assert'


function my_test_pass() {
    console.log('in test pass');
    assert.ok(true);
}

function my_test_fail() {
    console.log('in test fail');
    assert.ok(false);
}

run_tests([
    my_test_pass,
    my_test_fail,
]);
