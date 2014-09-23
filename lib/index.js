// Load modules

var Events = require('events');
var Hoek = require('hoek');


// Declare internals

var internals = {};


exports.horspool = function (haystack, needle) {

    Hoek.assert(haystack, 'Missing haystack');
    Hoek.assert(needle, 'Missing needle');

    // Compile

    var badCharShift = new Array(256);          // Lookup table of how many characters can be skipped for each match

    var nlen = needle.length;
    for (var i = 0; i < 256; ++i) {
        badCharShift[i] = nlen;                 // Defaults to the full length of the needle
    }

    var last = nlen - 1;
    for (i = 0; i < last; ++i) {                // For each character in the needle (skip last since its position is already the default)
        badCharShift[needle.charCodeAt(i)] = last - i;
    }

    // Match

    for (var pos = 0, hlen = haystack.length; hlen - pos >= nlen; pos += badCharShift[haystack.charCodeAt(pos + last)]) {
        for (i = last; haystack[pos + i] === needle[i]; --i) {
            if (i === 0) {
                return pos;
            }
        }
    }

    return -1;
};
