const axios = require('axios');


class Game {
    static async getGame(page = 1) {
        try {
            const data= await axios.get(`${process.env.APIURL}?key=${process.env.APIKEY}&page_size=20&page=${page}`);
            return data.data.results;
        } catch (error) {
            throw new Error('Failed to fetch games');
        }
        }


    static async getAllGames(page = 1) {
        try{
            const gamesData = await this.getGame(page);
            const games = Array.isArray(gamesData)
            ? gamesData.map(game => ({
                name: game.name,
                image: game.background_image || null,
                metacritic: game.metacritic || null,
                release_date: game.released || null,
                platforms: game.platforms ? game.platforms.map(platform => platform.platform.name) : [],
                genres: game.genres ? game.genres.map(genre => genre.name) : [],
                tags: game.tags ? game.tags.map(tag => tag.name) : []
            }))
            : [];
            return games;
        } catch (error) {
            throw new Error('Failed to fetch all games');
        }
    }
    static async searchGames(query) {
        try {
            const data = await axios.get(`${process.env.APIURL}?key=${process.env.APIKEY}&search=${query}`);
            const gamesData = data.data.results;
            const games = Array.isArray(gamesData)
                ? gamesData.map(game => ({
                    name: game.name,
                    image: game.background_image || null,
                    metacritic: game.metacritic || null,
                    release_date: game.released || null,
                    platforms: game.platforms ? game.platforms.map(platform => platform.platform.name) : [],
                    genres: game.genres ? game.genres.map(genre => genre.name) : [],
                    tags: game.tags ? game.tags.map(tag => tag.name) : []
                }))
                : [];
            return games;
        } catch (error) {
            throw new Error('Failed to search games');
        }
    }
}

module.exports = Game;