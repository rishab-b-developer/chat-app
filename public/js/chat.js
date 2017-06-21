var socket = io();

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
    var lastMessageHeight = newMessage.prev().innerHeight() ? newMessage.prev().innerHeight() : 0;

    if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
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

socket.on('connect', function () {
    console.log('conneced to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('joined a chat room');
        }
    });
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol');
    users.forEach(function (user) {
        var li = jQuery('<li></li>');
        li.text(user);
        ol.append(li);
    });
    jQuery('#users').html(ol);
});

socket.on('newMessage', function (textMessage) {
    showChatMessage(textMessage);
});

socket.on('newLocationMessage', function (locationMessage) {
    showChatMessage(locationMessage);
});

jQuery('#message-form').on('submit', function (event) {
    event.preventDefault();

    var messageTextBox = jQuery('[name="message"]');
    var params = jQuery.deparam(window.location.search);

    socket.emit('createMessage', {
        text: messageTextBox.val()
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
        var params = jQuery.deparam(window.location.search);
        socket.emit('createLocationMessage', {
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