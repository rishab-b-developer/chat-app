var socket = io();

const UUID = guid().toUpperCase();

socket.on('connect', function () {
    console.log('conneced to server');
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (message) {
    console.log('New Message:\n', message);

    var timestamp = message.createdAt; // replace your timestamp
    var date = new Date(timestamp);
    var dateStr = date.toLocaleString();
    var li = jQuery('<li></li>');
    li.text(`${message.from}:\t${message.text}\tat ${dateStr}`);
    jQuery('#messages').append(li);
});

socket.on('NewLocationMessage', function (message) {
    console.log('New Location Message:\n', message);

    var timestamp = message.createdAt; // replace your timestamp
    var date = new Date(timestamp);
    var dateStr = date.toLocaleString();
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from} at ${dateStr}`);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
    event.preventDefault();
    socket.emit('CreateMessage', {
        text: jQuery('[name="message"]').val(),
        from: UUID
    });
    jQuery('[name="message"]').val("")
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

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        socket.emit('CreateLocationMessage', {
            from: UUID,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        return alert('Unable to fetch location.');
    });
});