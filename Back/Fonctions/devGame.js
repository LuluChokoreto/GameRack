const {Dev_Games} = require('../Models/index.js');

class DevGame {
static async getAllDevGames() {
    try {
        const devGames = await Dev_Games.findAll();
        return devGames;
    } catch (error) {
        throw new Error('Failed to fetch developer games');
    }
}
}

module.exports = DevGame;