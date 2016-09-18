
function getEnclosingWord(text, caretPos) {
  var startIdx, endIdx;
  startIdx = endIdx = caretPos;
  var lastInspectedChar = "";
  var textLen = text.length;

  while (true) {
    if (startIdx === 0) {
      break;
    }
    startIdx -= 1;
    lastInspectedChar = text[startIdx];
    if (lastInspectedChar === ' ') {
      startIdx += 1;
      break;
    }
  }

  while (true) {

    if (endIdx >= textLen) {
      break;
    }

    lastInspectedChar = text[endIdx];
    endIdx += 1;
    if (lastInspectedChar === ' ') {
      break;
    }
  }

  var enclosingWord = text.slice(startIdx, endIdx);

  var res = {
    startIdx: startIdx,
    enclosingWord: enclosingWord
  };

  return res;
}

function isTag(word) {
  return (word.length > 0) && (word[0] === '#');
}

export function analyzeCurrentWord(text, caretPos) {
  var currentWordDesc = getEnclosingWord(text, caretPos);
  currentWordDesc['isTag'] = isTag(currentWordDesc.enclosingWord);
  return currentWordDesc
}
