
export function newBuffer(size) {
    return {
        size: size,
        buffer: [],
        gapStart: 0,
        gapEnd: size,
    }
}

export function writeToBuffer(buffer, thing) {
    const idx = buffer.gapStart;

    buffer.buffer[idx] = thing;
    buffer.gapStart += 1;
}


function gapSize(buffer) {
    return buffer.gapEnd - buffer.gapStart;
}


export function getNthEntry(buffer, n) {
    if (n >= buffer.gapStart) {
        return buffer.buffer[gapSize(buffer)];
    }
    else {
        return buffer.buffer[n];
    }
}


function moveCursorLeft(buffer, n) {
    let arrayBuffer = buffer.buffer;
    for (let i=0; i<n; i+=1) {
        buffer.gapStart -= 1;
        buffer.gapEnd -= 1;
        const fst = arrayBuffer[buffer.gapStart];
        const snd = arrayBuffer[buffer.gapEnd];
        arrayBuffer[buffer.gapStart] = snd;
        arrayBuffer[buffer.gapEnd] = fst;
    }
}


function moveCursorRight(buffer, n) {
    let arrayBuffer = buffer.buffer;
    for (let i=0; i<n; i+=1) {
        const fst = arrayBuffer[buffer.gapStart];
        const snd = arrayBuffer[buffer.gapEnd];
        arrayBuffer[buffer.gapStart] = snd;
        arrayBuffer[buffer.gapEnd] = fst;
        buffer.gapStart += 1;
        buffer.gapEnd += 1;
    }
}


export function moveCursor(buffer, n) {
    let numberOfMoves = Math.abs(n - buffer.gapStart);
    if (n > buffer.gapStart) {
        moveCursorRight(buffer, numberOfMoves);
    }
    else if (n < buffer.gapStart) {
        moveCursorLeft(buffer, numberOfMoves);
    }
}

export function walkUntil(buffer, startIdx, dir, pred) {
    let idx = startIdx;
    while (!pred(getNthEntry(buffer, idx)) || idx < 0 || idx >= buffer.size) {
        idx += dir;
    }
    return idx - dir;
}
