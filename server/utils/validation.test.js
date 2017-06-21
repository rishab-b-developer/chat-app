const expect = require('expect');

const {
    isRealString
} = require('./validation');


describe('isRealString', () => {
    it('should reject number 123', () => {
        var result = isRealString(123);
        expect(result).toBe(false);
    });

    it('should reject empty string \"\"', () => {
        var result = isRealString("");
        expect(result).toBe(false);
    });

    it('should accept proper string \"  rishab\"', () => {
        var result = isRealString("rishab");
        expect(result).toBe(true);
    });
});