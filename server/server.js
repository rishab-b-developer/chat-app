const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');
const {
    isRealString
} = require('./utils/validation');
const {
    Users
} = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const admin = 'Admin';

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        var error;
        if (!isRealString(params.name) || !isRealString(params.room)) {
            error = 'name & room name are required';  
        } else if (users.getUserByName(params.name) != null) {
            error = 'user with same name exists!';
        }

        if (error) {
            return callback(error);
        }

        socket.join(params.room);
        socket.emit('newMessage', generateMessage(admin, `Hi ${params.name}, Welcome to ${params.room} chat room!`));

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage(admin, `${params.name} has joined the chat.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUserById(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (location, callback) => {
        var user = users.getUserById(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));
        }
        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage(admin, `${user.name} has left the chat.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});