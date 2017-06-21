class Users {
    constructor() {
        this.list = [];
    };

    addUser(id, name, room) {
        var user = {
            id,
            name,
            room
        };
        this.list.push(user);
        return user;
    };

    removeUser(id) {
        var user = this.getUser(id);
        if (user) {
            this.list = this.list.filter(listUser => listUser.id !== id);
        }
        return user;
    };

    getUser(id) {
        var filteredUsers = this.list.filter(listUser => listUser.id === id);
        if (filteredUsers) {
            var user = filteredUsers[0];
            return user;
        }
        return null;
    };

    getUsersList(room) {
        var filteredUsers = this.list.filter(listUser => listUser.room === room);
        if (filteredUsers) {
            return filteredUsers.map((user) => user.name);
        }
        return null;
    };
}

module.exports = {
    Users
};