const { Sequelize, DataTypes, Model } = require('sequelize');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest 
  ? new Sequelize('sqlite::memory:', {logging: false}) 
  :new Sequelize(
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
  status: { type: DataTypes.STRING(32), allowNull: false},
  rating: { type: DataTypes.INTEGER, allowNull: true },
  platform: { type: DataTypes.STRING(32), allowNull: true },
  review: { type: DataTypes.STRING(255), allowNull: true, unique: true },
  code: { type: DataTypes.STRING(32), allowNull: false}
}, {
  sequelize,
  modelName: 'Game',
  tableName: 'games',
  timestamps: false,
});


class Dev_Games extends Model {}
Dev_Games.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  gameName: { type: DataTypes.STRING(255), allowNull: false },
  devName: { type: DataTypes.STRING(255), allowNull: false },
  img: { type: DataTypes.STRING(255), allowNull: false },
  realese_date: { type: DataTypes.STRING(32), allowNull: false },
}, {
  sequelize,
  modelName: 'Dev_Games',
  tableName: 'dev_games',
  timestamps: false,
});

module.exports = {
  sequelize,
  User,
  Game,
  Dev_Games
};

async function insertDefaultDevGames() {
  const count = await Dev_Games.count();
  if (count === 0) {
    await Dev_Games.bulkCreate([
      { gameName: "Grand Theft Auto: San Andreas", devName: "Alfredo", img: "https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg", realese_date: "2015-05-19" },
      { gameName: "Cyberpunk 2077", devName: "Alfredo", img: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg", realese_date: "2020-12-10" },
      { gameName: "Minecraft", devName: "Tristan", img: "https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg", realese_date: "2022-02-25" },
      { gameName: "Terraria", devName: "Tristan", img: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg", realese_date: "2018-04-20" },
      { gameName: "Hollow Knight", devName: "Ryan", img: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg", realese_date: "2017-02-24" },
      { gameName: "League of Legends", devName: "Ryan", img: "https://media.rawg.io/media/games/78b/78bc81e247fc7e77af700cbd632a9297.jp", realese_date: "2009-10-27" },
    ]);
    console.log("Données Dev_Games insérées !");
  }
}

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(insertDefaultDevGames);
}