// Load modules

var Lab = require('lab');
var Nigel = require('..');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;


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
});
