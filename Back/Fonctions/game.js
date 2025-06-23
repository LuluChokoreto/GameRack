const axios = require('axios');
const { Game } = require('../Models/index.js');
const jwt = require('jsonwebtoken');

class Games {
    //api RAWG
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

    //Your own API
    static async addFinishGame({name, image, rating, platform, review, token}) {
        try {
            const code = token.code;
            const game = await Game.create({
                name,
                image,
                rating,
                platform,
                review,
                code: code
            });
            return game;
        } catch (error) {
            throw new Error('Failed to add game');
        }
    }
    
    static async deleteGame(name, token) {
        try {
            const code = token.code;
            const game = await Game.destroy({
                where: {
                    name: name,
                    code: code
                }
            });
            if (game === 0) {
                throw new Error('Game not found or not owned by user');
            }
            return { message: 'Game deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete game');
        }
    }

}

module.exports = Games;