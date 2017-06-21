var socket = io();

const UUID = guid();

socket.on('connect', function () {
    console.log('conneced to server');
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (message) {
    console.log('New Message:\n', message);
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

//var timestamp = message.createdAt; // replace your timestamp
//var date = new Date(timestamp);
//var dateStr = date.toLocaleString();