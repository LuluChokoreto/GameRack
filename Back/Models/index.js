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
      { id: 1, gameGame: "Grand Theft Auto: San Andreas", devName: "Alfredo", img: "Grand Theft Auto: San Andreas.jpg", realse_date: "2015-05-19" },
      { id: 2, gameGame: "Cyberpunk 2077", devName: "Alfredo", img: "cyberpunk2077.jpg", realse_date: "2020-12-10" },
      { id: 3, gameGame: "Minecraft", devName: "Tristan", img: "Minecraft.jpg", realse_date: "2022-02-25" },
      { id: 4, gameGame: "Terraria", devName: "Tristan", img: "Terraria.jpg", realse_date: "2018-04-20" },
      { id: 5, gameGame: "Hollow Knight", devName: "Ryan", img: "hollowknight.jpg", realse_date: "2017-02-24" },
      { id: 6, gameGame: "League of Legends", devName: "Ryan", img: "League of Legends.jpg", realse_date: "2009-10-27" },
    ]);
    console.log("Données Dev_Games insérées !");
  }
}

sequelize.sync().then(insertDefaultDevGames);
