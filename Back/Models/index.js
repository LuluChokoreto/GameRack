const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false,
  }
);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

async function generateUniqueCode(UserModel) {
  function generateRandomCode(length = 4) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  let code;
  let exists = true;

  while (exists) {
    code = generateRandomCode();
    const existing = await UserModel.findOne({ where: { code } });
    exists = !!existing;
  }

  return code;
}

class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(32), allowNull: false },
  email: { type: DataTypes.STRING(48), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'user' },
  code: { type: DataTypes.STRING(32), allowNull: false, unique: true },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});

User.beforeValidate(async (user) => {
  user.code = await generateUniqueCode(User);
});

class Game extends Model {}
Game.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(32), allowNull: false },
  image: { type: DataTypes.STRING(255), allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  platform: { type: DataTypes.STRING(32), allowNull: false },
  review: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  code: { type: DataTypes.STRING(32), allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'Game',
  tableName: 'games',
  timestamps: false,
});


class Todo extends Model {}
Todo.init({}, {
  sequelize,
  modelName: 'Todo',
  tableName: 'todos',
  timestamps: false,
});

class Wish extends Model {}
Wish.init({}, {
  sequelize,
  modelName: 'Wish',
  tableName: 'wishes',
  timestamps: false,
});


module.exports = {
  sequelize,
  User,
  Game,
  Todo,
  Wish
};
