function verifyString(string) {
    if (string === null || string === undefined) {
        return false;
    }

    if (string.length < 1) {
        return false;
    }
}

module.exports = verifyString;