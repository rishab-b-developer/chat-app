const expect = require('expect');

const {generateMessage} = require('./message');

describe('Generate Message', () => {
    it('should generate to correct message object', () => {
        var from = 'Rishab';
        var text = 'This is test message.';
        var message = generateMessage(from, text);
        expect(message).toExist();
        expect(message).toInclude({
            from,
            text
        })
        expect(message.createdAt).toBeA('number');
    });
});