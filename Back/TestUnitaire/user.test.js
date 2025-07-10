const {User} = require('../Models/index.js');
const Users = require('../Fonctions/user');

describe('User class', () => {
    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, name: 'John Doe', email: ''}]
            jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers);
            const users = await Users.getAllUsers();
            expect(users).toEqual(mockUsers);
            User.findAll.mockRestore();
        });
        it('should return a error', async () => {
            jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Failed to fetch users'));
            await expect(Users.getAllUsers()).rejects.toThrow('Failed to fetch users');
            User.findAll.mockRestore();
        });
    });
    describe('addUser', () => {
        it('should add a user', async () => {
            const mockUser = { id: 1, name: 'John Doe', email: 'JohnDoe@gmail.com', password: 'hashedPassword', role: 'user' };
            jest.spyOn(User, 'create').mockResolvedValue(mockUser);
            const user = await Users.addUser({
                name: 'John Doe',
                email: 'JohnDoe@gmail.com',
                password: 'hashedPassword',
                role: 'user'
            });
            expect(user).toEqual(mockUser);
            User.create.mockRestore();
        });
        it('should return a error', async () => {
            jest.spyOn(User, 'create').mockRejectedValue(new Error('Failed to add user'));
            await expect(Users.addUser({
                name: 'John Doe',
                email: 'JohnDoe@gmail.com',
                password: 'hashedPassword',
                role: 'user'
            })).rejects.toThrow('Failed to add user');
            User.create.mockRestore();
        });
    });
    describe('loginUser', () => {
        it('should login a user', async () => {
            const mockUser = { id: 1, name: 'John Doe', email: 'JohnDoe@gmail.com', password: 'hashedPassword', code: 'uniqueCode', role: 'user' };
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(require('bcrypt'), 'compareSync').mockReturnValue(true);
            jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValue('mockedToken');
            const result = await Users.loginUser({
                email: 'JohnDoe@gmail.com',
                password: 'hashedPassword'
            });
            expect(result).toEqual({ name: 'John Doe', token: 'mockedToken' });
            User.findOne.mockRestore();
            require('bcrypt').compareSync.mockRestore();
            require('jsonwebtoken').sign.mockRestore();
        });
        it('should return a error if user not found', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);
            await expect(Users.loginUser({
                email: 'JohnDoe@gmail.com',
                password: 'hashedPassword'
            })).rejects.toThrow('Failed to login user');
            User.findOne.mockRestore();
        });
    });
    describe('updateRole', () => {
        it('should update user role to admin', async () => {
            const mockUser = [1];
            jest.spyOn(User, 'update').mockResolvedValue(mockUser);
            const result = await Users.updateRole({
                email: 'JohnDoe@gmail.com'
            })
            expect(result).toEqual(mockUser);
            User.update.mockRestore();
        });
        it('should return a error', async () => {
            jest.spyOn(User, 'update').mockRejectedValue(new Error('Failed to update user role'));
            await expect(Users.updateRole({
                email: 'JohnDoe@gmail.com'
            })).rejects.toThrow('Failed to update user role');
            User.update.mockRestore();
        });
    });

})