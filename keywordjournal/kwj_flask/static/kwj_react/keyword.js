
function getAvailableKeywords() {
    return [
        {
            key: 0,
            keyword: 'Apple',
            args: [
                {
                    name: 'color',
                    type: 'string'
                }
            ]
        },
        {
            key: 1,
            keyword: 'Banana',
            args: [
                {
                    name: 'color',
                    type: 'string'
                }
            ]
        },
        {
            key: 2,
            keyword: 'Apricot',
            args: [
                {
                    name: 'color',
                    type: 'string'
                }
            ]
        },
        {
            key: 3,
            keyword: 'Bad',
            args: [
                {
                    name: 'how bad',
                    type: 'number'
                }
            ]
        },
        {
            key: 4,
            keyword: 'Good',
            args: [
                {
                    name: 'how good',
                    type: 'number'
                }
            ]
        },
        {
            key: 5,
            keyword: 'Goofy',
            args: [
                {
                    name: 'how goofy',
                    type: 'number'
                }
            ]
        }
    ];
}


function getMatchingKeywords(partial) {
    var availableKeywords = getAvailableKeywords();
    var res = [];
    for (var i=0; i < availableKeywords.length; i++) {
        if (availableKeywords[i].keyword.startsWith(partial)) {
            res.push(availableKeywords[i]);
        }
    }
    return res;
}