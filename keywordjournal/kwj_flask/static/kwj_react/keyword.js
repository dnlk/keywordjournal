
function getAvailableKeywords() {
    return ['Apple', 'Banana', 'Bad', 'Goofy', 'Good'];
}


function getMatchingKeywords(partial) {
    var availableKeywords = getAvailableKeywords();
    var res = [];
    for (var i=0; i < availableKeywords.length; i++) {
        if (availableKeywords[i].startsWith(partial)) {
            res.push(availableKeywords[i]);
        }
    }
    return res;
}