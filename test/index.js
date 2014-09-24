// Load modules

var Lab = require('lab');
var Nigel = require('..');
var Vise = require('vise');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;


describe('compile()', function () {

    it('processes needle', function (done) {

        var needle = 'abcdefghijklmnopqrstuvwxyz';
        expect(Nigel.compile(needle)).to.deep.equal({
            value: new Buffer(needle),
            length: 26,
            badCharShift: [26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26]
        });

        done();
    });
});

describe('horspool()', function () {

    it('finds needle', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mnopq';

        expect(Nigel.horspool(haystack, needle)).to.equal(12);
        done();
    });

    it('does not find needle', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mno2pq';

        expect(Nigel.horspool(haystack, needle)).to.equal(-1);
        done();
    });

    it('finds needle from position', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mnopq';

        expect(Nigel.horspool(haystack, needle, 11)).to.equal(12);
        done();
    });

    it('does not find needle from position', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mnopq';

        expect(Nigel.horspool(haystack, needle, 13)).to.equal(-1);
        done();
    });

    it('finds buffer needle in buffer haystack', function (done) {

        var haystack = new Buffer('abcdefghijklmnopqrstuvwxyz');
        var needle = new Buffer('mnopq');

        expect(Nigel.horspool(haystack, needle)).to.equal(12);
        done();
    });

    it('finds string needle in buffer haystack', function (done) {

        var haystack = new Buffer('abcdefghijklmnopqrstuvwxyz');
        var needle = 'mnopq';

        expect(Nigel.horspool(haystack, needle)).to.equal(12);
        done();
    });

    it('finds buffer needle in string haystack', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = new Buffer('mnopq');

        expect(Nigel.horspool(haystack, needle)).to.equal(12);
        done();
    });

    it('finds needle in vise haystack', function (done) {

        var haystack = new Vise(['abcdefghijklmn', 'opqrstuvwxyz']);
        expect(Nigel.horspool(haystack, 'mnopq')).to.equal(12);
        done();
    });

    it('finds needle in pushed vise haystack', function (done) {

        var haystack = new Vise();
        haystack.push('abcdefghijklmn');
        haystack.push('opqrstuvwxyz');
        expect(Nigel.horspool(haystack, 'mnopq')).to.equal(12);
        done();
    });
});

describe('all()', function () {

    it('finds needle', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mnopq';

        expect(Nigel.all(haystack, needle)).to.deep.equal([12]);
        done();
    });

    it('does not find needle', function (done) {

        var haystack = 'abcdefghijklmnopqrstuvwxyz';
        var needle = 'mno2pq';

        expect(Nigel.all(haystack, needle)).to.deep.equal([]);
        done();
    });

    it('finds multiple needles', function (done) {

        var haystack = 'abc123def123ghi123jkl123mno123pqr123stu123vwx123yz';
        var needle = '123';

        expect(Nigel.all(haystack, needle)).to.deep.equal([3, 9, 15, 21, 27, 33, 39, 45]);
        done();
    });

    it('finds multiple needles from position', function (done) {

        var haystack = 'abc123def123ghi123jkl123mno123pqr123stu123vwx123yz';
        var needle = '123';

        expect(Nigel.all(haystack, needle, 11)).to.deep.equal([15, 21, 27, 33, 39, 45]);
        done();
    });
});

describe('Stream', function () {

    it('parses a stream haystack', function (done) {

        var result = [];

        var stream = new Nigel.Stream('123');
        stream.on('finish', function () {

            expect(result).to.deep.equal(['abc', 1, 'de', 'fg', 1, 'hij1', 1, 'klm', 1, 'nop']);
            done();
        });

        stream.on('needle', function () {

            result.push(1);
        });

        stream.on('haystack', function (chunk) {

            result.push(chunk.toString());
        });

        stream.write('abc123de');
        stream.write('fg12');
        stream.write('3hij11');
        stream.write('23klm');
        stream.write('123');
        stream.write('nop');
        stream.end();
    });

    it('flushes data buffers when more recent one is bigger than needle', function (done) {

        var result = [];

        var stream = new Nigel.Stream('123');
        stream.on('finish', function () {

            expect(result).to.deep.equal(['abc', null, 'de', 'fghij', 'klmnop', 'q', null, 'r', 'stuv', 'wxy', 'zabc']);
            done();
        });

        stream.on('needle', function () {

            result.push(null);
        });

        stream.on('haystack', function (chunk, g) {

            expect(stream._haystack.length).to.be.lessThan(7);
            result.push(chunk.toString());
        });

        stream.write('abc123de');
        stream.write('fghij');
        stream.write('klmnop');
        stream.write('q123r');
        stream.write('stuv');
        stream.write('wxy');
        stream.write('zabc');
        stream.end();
    });
});