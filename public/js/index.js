var socket = io();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

function getDisplayTime(timestamp) {
    return moment(timestamp).format('h:mm a');
};

function getTemplateInfo(chatMessage) {
    return {
        from: chatMessage.from,
        text: chatMessage.text,
        url: chatMessage.url,
        createdAt: getDisplayTime(chatMessage.createdAt)
    };
};

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight()?newMessage.prev().innerHeight():0;

    console.log(`cH:${clientHeight}  sT:${scrollTop}  sH:${scrollHeight}  nMH:${newMessageHeight}  lMH:${lastMessageHeight}`);

    if ((clientHeight+scrollTop+newMessageHeight+lastMessageHeight) >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

function showChatMessage(chatMessage) {
    var messages = jQuery('#messages');
    var templateId = (chatMessage.url) ? '#location-message-template' : '#message-template';
    var template = jQuery(templateId).html();
    var html = Mustache.render(template, getTemplateInfo(chatMessage));
    messages.append(html);
    scrollToBottom();
};

const UUID = guid().toUpperCase();

socket.on('connect', function () {
    console.log('conneced to server');
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('NewMessage', function (textMessage) {
    showChatMessage(textMessage);
});

socket.on('NewLocationMessage', function (locationMessage) {
    showChatMessage(locationMessage);
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