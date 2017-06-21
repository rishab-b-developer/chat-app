const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');


const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const admin = 'Admin';

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New connection made');

    socket.emit('NewMessage', generateMessage(admin, 'Welcome to chat!'));
    socket.broadcast.emit('NewMessage', generateMessage(admin, 'A new user has joined the chat.'));

    socket.on('CreateMessage', (message) => {
        console.log(`New message recevied:\n${JSON.stringify(message, undefined, 4)}`);
        io.emit('NewMessage', generateMessage(message.from, message.text));
    });

    socket.on('CreateLocationMessage', (location) => {
        io.emit('NewLocationMessage', generateLocationMessage(location.from, location.latitude, location.longitude));
    });

    socket.on('disconnect', () => {
        console.log('New disconnection made');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});