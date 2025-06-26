const {Wish} = require('../Models/index.js');

class Wishes {
    static async getAllWishes(token){
        try {
            return await Wish.findAll({
                where: {
                    code: token
                }
            });
        } catch (error) {
            throw new Error('Failed to fetch wishes');
        }
    }

    static async addWish({name, image, token}) {
        try {
            const wish = await Wish.create({
                name,
                image,
                code: token
            });
            return wish;
        } catch (error) {
            throw new Error('Failed to add wish');
        }
    }

    static async deleteWish(name, token) {
        try {
            const wish = await Wish.findOne({
                where: {
                    name,
                    code: token
                }
            });
            await wish.destroy();
            return { message: 'Wish deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete wish');
        }
    }

}

module.exports = Wishes;
