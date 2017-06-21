var socket = io();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

const UUID = guid().toUpperCase();

socket.on('connect', function () {
    console.log('conneced to server');
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (message) {
    var dateStr = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: dateStr
    });
    jQuery('#messages').append(html);
});

socket.on('NewLocationMessage', function (message) {
    var dateStr = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: dateStr
    });
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (event) {
    event.preventDefault();
    var messageTextBox = jQuery('[name="message"]');
    socket.emit('CreateMessage', {
        text: messageTextBox.val(),
        from: UUID
    }, function () {
        messageTextBox.val("");
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('CreateLocationMessage', {
            from: UUID,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            locationButton.removeAttr('disabled').text('Send Location');
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        return alert('Unable to fetch location.');
    });
});