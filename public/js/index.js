var socket = io();

function updateChatRoomText(){
    var selectRoom = jQuery('#select-room');
    var roomName = selectRoom.val();
    var inputRoom = jQuery('#chat-room-name');
    inputRoom.val(roomName);
};

function updateChatRooms(rooms) {
    var selectRoom = jQuery('#select-room');
    if (rooms) {
        var templateId = '#room-template';
        var template = jQuery(templateId).html();
        rooms.forEach(function (room) {
            var html = Mustache.render(template, {
                room
            });
            selectRoom.append(html);
        });
        selectRoom.val(rooms[0]);
        selectRoom.change(updateChatRoomText);
    } else {
        selectRoom.val('')
        selectRoom.html('');
    }
    updateChatRoomText();
};

socket.on('connect', function () {
    console.log('conneced to server');
    socket.emit('connected', {}, function (rooms) {
        updateChatRooms(rooms);
    });
});

socket.on('disconnect', function () {
    console.log('disconneced from server');
});