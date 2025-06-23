const {User} = require('../Models/index.js');

class Users{
  static async getAllUsers() {
    const allUsers = await User.findAll();
    return allUsers;
  }
  static async addUser({name, email, password}) {
    const user = await User.create({
        name,
        email,
        password
    });
    return user;
}
}
module.exports = Users;