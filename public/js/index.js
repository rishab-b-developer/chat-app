var socket = io();

socket.on('connect', function () {
    console.log('conneced to server');
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (message) {
    console.log('New Message');
    var timestamp = message.createdAt; // replace your timestamp
    var date = new Date(timestamp);
    var reply = prompt(`You received a new message saying \"${message.text}\" from ${message.from} at ${date.toLocaleString()}.\n Do you want to reply?`, 'Enter your reply here.');

    if (reply) {
        socket.emit('CreateMessage', {
            text: reply,
            from: 'Rishab'
        });
    }
});