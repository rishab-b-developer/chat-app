var socket = io();

socket.on('connect', function () {
    console.log('conneced to server');
    socket.emit('CreateMessage', {
        text: 'Yeah! lets meet up at 7!',
        from: 'Rishab'
    });
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (message) {
    console.log('New Message:\n', message);
});



//var timestamp = message.createdAt; // replace your timestamp
//var date = new Date(timestamp);
//var dateStr = date.toLocaleString();