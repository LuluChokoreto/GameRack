const {User} = require('../Models/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  

class Users{

  static async getAllUsers() {
    try{

      const allUsers = await User.findAll();
      return allUsers;
    }catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  static async addUser({name, email, password, role}) {
    try {
      const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: role || 'user'
      });
      return user;
    } catch (error) {
      throw new Error('Failed to add user');
    }
}

  static async loginUser({email, password}) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ id: user.id, code: user.code, role: user.role }, process.env.JWTSECRET);
    return { user, token };
  } catch (error) {
    throw new Error('Failed to login user');
  }
  }

  static async updateRole(email){
    try {
      const user = await User.update(
        { role: 'admin' }, 
        { where: { email } }
      )
      return user;
    } catch (error) {
      throw new Error('Failed to update user role');
    }
  }
}
module.exports = Users;