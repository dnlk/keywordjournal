
export function run_tests(tests) {
    let failures = [];
    tests.forEach(function(test_function){
        console.log('Running test: ' + test_function.name);
        try {
            test_function();
        }
        catch (e) {
            failures.push(test_function.name);
            console.log(e);
        }
    });
    let numTests = tests.length;
    let numFailures = failures.length;
    let numPassed = numTests - numFailures;
    console.log('Number of tests run: ' + numTests);
    console.log('Number of tests failed: ' + numFailures);
    console.log('Number of tests passed: ' + numPassed);
}
