const expect = require('expect');

const {
    Users
} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.list = [{
            id: 123,
            name: 'X',
            room: 'A'
        }, {
            id: 456,
            name: 'Y',
            room: 'B'
        }, {
            id: 789,
            name: 'Z',
            room: 'A'
        }]
    });

    it('should add user', () => {
        var user = users.addUser(999, 'J', 'A');
        expect(user).toExist();
        expect(users.list).toInclude(user);
    });

    it('should remove user with id 456', () => {
        var id = 456;
        var user = users.removeUser(id);
        expect(user).toExist();
        expect(users.list.length).toBe(2);
    });

    it('should get user by id 123', () => {
        var id = 123;
        var user = users.getUserById(id);
        expect(user).toExist();
        expect(user.id).toBe(id);
    });

    it('should get user by name Y', () => {
        var name = 'Y';
        var user = users.getUserByName(name);
        expect(user).toExist();
        expect(user.name).toBe(name);
    });

    it('should get users for room A', () => {
        var roomA = 'A';
        var roomAUsers = users.getUsersList(roomA);
        expect(roomAUsers).toExist();
        expect(roomAUsers).toEqual(['X', 'Z'])
    });
});