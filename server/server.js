const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New connection made');

    socket.emit('NewMessage', {
        text: 'Do you join me for movie tonight?',
        from: 'Ria',
        createdAt: Date.now()
    });

    socket.on('CreateMessage', (message) => {
        message.createdAt = Date.now();
        console.log(`New message recevied:\n${JSON.stringify(message, undefined, 4)}`);
    });

    socket.on('disconnect', () => {
        console.log('New disconnection made');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});