'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const Nigel = require('..');
const Teamwork = require('teamwork');
const Vise = require('vise');


// Declare internals

const internals = {};


// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('compile()', () => {

    it('processes needle', () => {

        const needle = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        expect(Nigel.compile(needle)).to.equal({
            value: needle,
            lastPos: 25,
            last: 122,
            length: 26,
            badCharShift: Buffer.from([26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26])
        });
    });

    it('throws on empty needle', () => {

        expect(() => {

            Nigel.compile(Buffer.from(''));
        }).to.throw('Missing needle');
    });

    it('throws on empty needle', () => {

        expect(() => {

            Nigel.compile();
        }).to.throw('Missing needle');
    });
});

describe('horspool()', () => {

    it('finds needle', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mnopq');

        expect(Nigel.horspool(haystack, needle)).to.equal(12);
    });

    it('does not find needle', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mnxpq');

        expect(Nigel.horspool(haystack, needle)).to.equal(-1);
    });

    it('does not find needle (tail match)', () => {

        const haystack = Buffer.from('q2q2q2q2q');
        const needle = Buffer.from('22q');

        expect(Nigel.horspool(haystack, needle)).to.equal(-1);
    });

    it('finds needle from position', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mnopq');

        expect(Nigel.horspool(haystack, needle, 11)).to.equal(12);
    });

    it('does not find needle from position', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mnopq');

        expect(Nigel.horspool(haystack, needle, 13)).to.equal(-1);
    });

    it('finds needle in vise haystack', () => {

        const haystack = new Vise([Buffer.from('abcdefghijklmn'), Buffer.from('opqrstuvwxyz')]);
        expect(Nigel.horspool(haystack, Buffer.from('mnopq'))).to.equal(12);
    });

    it('finds needle in pushed vise haystack', () => {

        const haystack = new Vise();
        haystack.push(Buffer.from('abcdefghijklmn'));
        haystack.push(Buffer.from('opqrstuvwxyz'));
        expect(Nigel.horspool(haystack, Buffer.from('mnopq'))).to.equal(12);
    });
});

describe('all()', () => {

    it('finds needle', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mnopq');

        expect(Nigel.all(haystack, needle)).to.equal([12]);
    });

    it('does not find needle', () => {

        const haystack = Buffer.from('abcdefghijklmnopqrstuvwxyz');
        const needle = Buffer.from('mno2pq');

        expect(Nigel.all(haystack, needle)).to.equal([]);
    });

    it('finds multiple needles', () => {

        const haystack = Buffer.from('abc123def123ghi123jkl123mno123pqr123stu123vwx123yz');
        const needle = Buffer.from('123');

        expect(Nigel.all(haystack, needle)).to.equal([3, 9, 15, 21, 27, 33, 39, 45]);
    });

    it('finds multiple needles from position', () => {

        const haystack = Buffer.from('abc123def123ghi123jkl123mno123pqr123stu123vwx123yz');
        const needle = Buffer.from('123');

        expect(Nigel.all(haystack, needle, 11)).to.equal([15, 21, 27, 33, 39, 45]);
    });
});

describe('Stream', () => {

    it('parses a stream haystack', async () => {

        const team = new Teamwork();
        const result = [];

        const stream = new Nigel.Stream(Buffer.from('123'));
        stream.on('close', () => {

            expect(result).to.equal(['abc', 1, 'de', 'fg', 1, 'hij1', 1, 'klm', 1, 'nop']);
            team.attend();
        });

        stream.on('needle', () => {

            result.push(1);
        });

        stream.on('haystack', (chunk) => {

            result.push(chunk.toString());
        });

        stream.write('abc123de');
        stream.write('fg12');
        stream.write('3hij11');
        stream.write('23klm');
        stream.write('123');
        stream.write('nop');
        stream.end();

        await team.work;
    });

    it('flushes data buffers when more recent one is bigger than needle', async () => {

        const team = new Teamwork();
        const result = [];

        const stream = new Nigel.Stream(Buffer.from('123'));
        stream.on('close', () => {

            expect(result).to.equal(['abc', null, 'de', 'fghij', 'klmnop', 'q', null, 'r', 'stuv', 'wxy', 'zabc']);
            team.attend();
        });

        stream.on('needle', () => {

            result.push(null);
        });

        stream.on('haystack', (chunk, g) => {

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

        await team.work;
    });

    it('parses a stream haystack (partial needle first)', async () => {

        const team = new Teamwork();
        const result = [];

        const stream = new Nigel.Stream(Buffer.from('123'));
        stream.on('close', () => {

            expect(result).to.equal([1, 'abc', 1, 'de', 'fg', 1, 'hij1', 1, 'klm', 1, 'nop']);
            team.attend();
        });

        stream.on('needle', () => {

            result.push(1);
        });

        stream.on('haystack', (chunk) => {

            result.push(chunk.toString());
        });

        stream.write('12');
        stream.write('3abc123de');
        stream.write('fg12');
        stream.write('3hij11');
        stream.write('23klm');
        stream.write('123');
        stream.write('nop');
        stream.end();

        await team.work;
    });

    it('parses a stream haystack (partial needle last)', async () => {

        const team = new Teamwork();
        const result = [];

        const stream = new Nigel.Stream(Buffer.from('123'));
        stream.on('close', () => {

            expect(result).to.equal([1, 'abc', 1, 'de', 'fg', 1, 'hij1', 1, 'klm', 1, 'nop', '1']);
            team.attend();
        });

        stream.on('needle', () => {

            result.push(1);
        });

        stream.on('haystack', (chunk) => {

            result.push(chunk.toString());
        });

        stream.write('12');
        stream.write('3abc123de');
        stream.write('fg12');
        stream.write('3hij11');
        stream.write('23klm');
        stream.write('123');
        stream.write('nop1');
        stream.end();

        await team.work;

    });

    describe('needle()', () => {

        it('changes needle mid stream', async () => {

            const team = new Teamwork();
            const result = [];

            const stream = new Nigel.Stream(Buffer.from('123'));
            stream.on('close', () => {

                expect(result).to.equal([1, 'abc', 1, 'de', 'fg', '12', '3hi', 1, 'j11', '23klm', '123', 'no', 1, 'p1']);
                team.attend();
            });

            stream.on('needle', () => {

                result.push(1);
            });

            stream.on('haystack', (chunk) => {

                result.push(chunk.toString());
            });

            stream.write('12');
            stream.write('3abc123de');
            stream.write('fg12');
            stream.needle(Buffer.from('45'));
            stream.write('3hi45j11');
            stream.write('23klm');
            stream.write('123');
            stream.write('no45p1');
            stream.end();

            await team.work;
        });

        it('changes needle mid stream (on haystack)', async () => {

            const team = new Teamwork();
            const result = [];

            const stream = new Nigel.Stream(Buffer.from('123'));
            stream.on('close', () => {

                expect(result).to.equal([1, 'abc', 1, 'de', 'fg', /**/ '12', '3hi', 1, 'j11', '23klm', '123', 'no', 1, 'p1']);
                team.attend();
            });

            stream.on('needle', () => {

                result.push(1);
            });

            stream.on('haystack', (chunk) => {

                result.push(chunk.toString());
                if (result.length === 5) {                  // After getting 'fg'
                    stream.needle(Buffer.from('45'));
                }
            });

            stream.write('12');
            stream.write('3abc123de');
            stream.write('fg12');
            stream.write('3hi45j11');
            stream.write('23klm');
            stream.write('123');
            stream.write('no45p1');
            stream.end();

            await team.work;
        });

        it('changes needle mid stream (on needle)', async () => {

            const team = new Teamwork();
            const result = [];

            const stream = new Nigel.Stream(Buffer.from('12'));
            stream.on('close', () => {

                expect(result).to.equal(['a', 1, /**/ '3abc', 1, 'de', 'fg', 1, 'hi45j1', 1, 'klm', 1, 'no45p', '1']);
                team.attend();
            });

            stream.on('needle', () => {

                result.push(1);
                if (result.length === 2) {                  // After first needle
                    stream.needle(Buffer.from('123'));
                }
            });

            stream.on('haystack', (chunk) => {

                result.push(chunk.toString());
            });

            stream.write('a12');
            stream.write('3abc123de');
            stream.write('fg12');
            stream.write('3hi45j11');
            stream.write('23klm');
            stream.write('123');
            stream.write('no45p1');
            stream.end();

            await team.work;
        });

        it('retains partial needle before needle', async () => {

            const team = new Teamwork();
            const result = [];

            const stream = new Nigel.Stream(Buffer.from('\r\n'));
            stream.on('close', () => {

                expect(result).to.equal(['abc', 1, 'defg', 1, 1, 'hijk\r', 1, 'lmnop\r', 1]);
                team.attend();
            });

            stream.on('needle', () => {

                result.push(1);
            });

            stream.on('haystack', (chunk) => {

                result.push(chunk.toString());
            });

            stream.write('abc\r\ndefg\r\n\r\nhijk\r\r\nlmnop\r\r\n');
            stream.end();

            await team.work;
        });

        it('emits events in correct order when nesting streams', async () => {

            const team = new Teamwork();
            const test = '1x2|3|4x|5|6|x7';
            let result = '';

            const x = new Nigel.Stream(Buffer.from('x'));
            const l = new Nigel.Stream(Buffer.from('|'));

            x.once('close', () => {

                l.end();
            });

            l.once('close', () => {

                expect(result).to.equal(test.replace(/\|/g, '[').replace(/x/g, '*'));
                team.attend();
            });

            x.on('needle', () => {

                result = result + '*';
            });

            x.on('haystack', (chunk) => {

                l.write(chunk);
            });

            l.on('needle', () => {

                result = result + '[';
            });

            l.on('haystack', (chunk) => {

                result = result + chunk.toString();
            });

            x.write(test);
            x.end();

            await team.work;
        });
    });

    describe('flush()', () => {

        it('emits events in correct order when nesting streams (partial needle)', async () => {

            const team = new Teamwork();
            const test = '7vx7vx7vx';
            let result = '';

            const x = new Nigel.Stream(Buffer.from('x'));
            const l = new Nigel.Stream(Buffer.from('v|'));

            x.once('close', () => {

                l.end();
            });

            l.once('close', () => {

                expect(result).to.equal(test.replace(/v\|/g, '[').replace(/x/g, '*'));
                team.attend();
            });

            x.on('needle', () => {

                l.flush();
                result = result + '*';
            });

            x.on('haystack', (chunk) => {

                l.write(chunk);
            });

            l.on('needle', () => {

                result = result + '[';
            });

            l.on('haystack', (chunk) => {

                result = result + chunk.toString();
            });

            x.write(test);
            x.end();

            await team.work;
        });
    });
});
