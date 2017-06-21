const expect = require('expect');

const {
    generateMessage,
    generateLocationMessage
} = require('./message');

describe('Generate Message', () => {
    it('should generate correct message object', () => {
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

describe('Generate Location Message', () => {
    it('should generate correct location message object', () => {
        var from = 'Rishab';
        const latitude = '19.12';
        const longitude = '73.02';
        var message = generateLocationMessage(from, latitude, longitude)
        expect(message).toExist();
        expect(message).toInclude({
            from,
            url: `https://www.google.co.in/maps?q=${latitude},${longitude}`,
        })
        expect(message.createdAt).toBeA('number');
    });
});