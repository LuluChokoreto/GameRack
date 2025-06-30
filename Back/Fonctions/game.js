const axios = require('axios');
const { Game } = require('../Models/index.js');

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
                id: game.id,
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

    static async searchGames(query=null, platform = null, release_date = null) {
        try {
            let url = `${process.env.APIURL}?key=${process.env.APIKEY}`;
            if (query) url += `&search=${encodeURIComponent(query)}&search_precise=true`;
            if (platform) url += `&platforms=${encodeURIComponent(platform)}`;
            if (release_date){
                const date = `${release_date}-01-01,${release_date}-12-31`;
                url += `&dates=${encodeURIComponent(date)}`;
            } 
            const data = await axios.get(url);
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

    static async getSpecificGame(id) {
        try {
            const data = await axios.get(`${process.env.APIURL}/${id}?key=${process.env.APIKEY}`);
            const game = {
                id: data.data.id,
                name: data.data.name,
                image: data.data.background_image || null,
                metacritic: data.data.metacritic || null,
                release_date: data.data.released || null,
                platforms: data.data.platforms ? data.data.platforms.map(platform => platform.platform.name) : [],
                genres: data.data.genres ? data.data.genres.map(genre => genre.name) : [],
                tags: data.data.tags ? data.data.tags.map(tag => tag.name) : [],
                description: data.data.description_raw || null,
                developers: data.data.developers ? data.data.developers.map(dev => dev.name) : [],
                publishers: data.data.publishers ? data.data.publishers.map(pub => pub.name) : [],
            };
            return game;
            
        } catch (error) {
            throw new Error('Failed to fetch specific game');
            
        }
    }

    static async getRandomGame() {
        try {
            const totalGames = 888734;
            const totalPages = Math.floor(totalGames / 6);

            const randomPage = Math.floor(Math.random() * totalPages) + 1;

            const data = await axios.get(`${process.env.APIURL}?key=${process.env.APIKEY}&page_size=6&page=${randomPage}`);
            const gamesData = data.data.results;
            const games = Array.isArray(gamesData)
                ? gamesData.map(game => ({
                    id: game.id,
                    name: game.name,
                    image: game.background_image || null,
                }))
                : [];
            return games;
        }catch (error) {
            throw new Error('Failed to fetch random game');
        }
    }

    static async getBestGames() {
        try {
        const ordering = '-rating';
        const data = await axios.get(`${process.env.APIURL}?key=${process.env.APIKEY}&page_size=6&ordering=${ordering}&exclude_additions=true&metacritic=90,100`);
        const gamesData = data.data.results;
        const games = Array.isArray(gamesData)
            ? gamesData.map(game => ({
                id: game.id,
                name: game.name,
                image: game.background_image || null,
                metacritic: game.metacritic || null,
                release_date: game.released || null,
            }))
            : [];
            return games;
        } catch (error) {
            throw new Error('Failed to fetch best games');
        }
    }

    static async getComingSoonGames() {
        try {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 30);

            const formatDate = d => d.toISOString().split('T')[0];
            const dateRange = `${formatDate(date)},${formatDate(endDate)}`;

            const order = 'released';
            const data = await axios.get(`${process.env.APIURL}?key=${process.env.APIKEY}&dates=${dateRange}&ordering=${order}`);
            const gamesData = data.data.results;
            const games = Array.isArray(gamesData)
                ? gamesData.map(game => ({
                    id: game.id,
                    name: game.name,
                    image: game.background_image || null,
                    release_date: game.released || null,
                }))
                : [];
                return games;
        } catch (error) {
            throw new Error('Failed to fetch coming soon games');
        }
    }

    static async getAllPlatforms(){
        try {
            const url = process.env.APIURL.replace(/game(s)?/i, 'platforms');
            const [page1, page2] = await Promise.all([
            axios.get(`${url}?key=${process.env.APIKEY}&page=1`),
            axios.get(`${url}?key=${process.env.APIKEY}&page=2`)
            ]);
            const allResults = [...page1.data.results, ...page2.data.results];
            
            return allResults.map(platform => ({
            id: platform.id,
            name: platform.name,
            slug: platform.slug
        }));
            
        } catch (error) {
            throw new Error('Failed to fetch platforms');
        }
    }

    //Your own API
    static async getUserGames(code){
        try {
            const games = await Game.findAll({
                where: {
                    code: code
                },
            });
            return games
        } catch (error) {
            throw new Error('Failed to fetch user games');
        }

    }

    static async getAllReview(){
        try {
            const games = await Game.findAll();
            const reviewNotNull = []
            let nullCount = 0
            games.forEach(game => {
                if(game.review !== null){
                    reviewNotNull.push(game.review);
                }else{
                    nullCount ++
                }
            });

            return {
            reviews: reviewNotNull,
            nullCount: nullCount
        };
        } catch (error) {
            throw new Error('Failed to fetch reviews');
        }
    }

    // ADD
    static async addFinishGame({name, image, rating, platform, review, token, status= "finish"}) {
        try {
            const game = await Game.create({
                name,
                image,
                status,
                rating,
                platform,
                review,
                code: token
            });
            return game;
        } catch (error) {
            throw new Error('Failed to add game');
        }
    }
    
    static async addWish({name, image, token, status= "wish"}) {
        try {
            const game = await Game.create({
                name,
                image,
                status,
                code: token
            });
            return game;
        } catch (error) {
            throw new Error('Failed to add wish');
        }

    }
    
    static async addTodo({name, image, platform, token, status= "todo"}) {
        try {
            const game = await Game.create({
                name,
                image,
                status,
                platform,
                code: token
            });
            return game;
        } catch (error) {
            throw new Error('Failed to add todo');
        }
    }

    // UPDATE
    static async updateStatus(name, rating=null, platform=null, review=null, token) {
        try {
            if( rating && review && platform){
               return await Game.update(
                    { status: "finish", rating: rating, platform: platform, review: review },
                    { where: { name: name, code: token } }
                );
            }else if(platform){
               return await Game.update(
                    { status: "todo" ,platform: platform },
                    { where: { name: name, code: token } }
                );
            }else{
                throw new Error('Invalid parameters for game status update');
            }

        } catch (error) {
            throw new Error('Failed to update game status');
        }
    }

    // DELETE
    static async deleteGame(name, token) {
        try {
            const game = await Game.destroy({
                where: {
                    name: name,
                    code: token,
                    status: "finish"
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
    
    static async deleteWish(name, token) {
        try {
            const wish = await Game.destroy({
                where: {
                    name: name,
                    code: token,
                    status: "wish"
                }
            });
            if (wish === 0) {
                throw new Error('Wish not found or not owned by user');
            }
            return { message: 'Wish deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete wish');
        }
    }

    static async deleteTodo(name, token) {
        try {
            const todo = await Game.destroy({
                where: {
                    name: name,
                    code: token,
                    status: "todo"
                }
            });
            if (todo === 0) {
                throw new Error('Todo not found or not owned by user');
            }
            return { message: 'Todo deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete todo');
        }
    }

    static async deleteReview(name, review) {
        try {
            const review = await Game.update(
                { review: null },
                { where: { name: name, review: review, status: "finish" } }
            );
            return { message: 'Review deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete review');
        }
    }

}

module.exports = Games;