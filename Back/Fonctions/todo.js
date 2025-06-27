const {Todo} = require('../Models/index.js');

class Todos {
    static async getAllTodos(token){
        try {
            return await Todo.findAll({
                where: {
                    code: token
                }
            });
        } catch (error) {
            throw new Error('Failed to fetch todos');
            
        }
    }

    static async addTodo({name, image, platform, token}) {
        try {
            const todo = await Todo.create({
                name,
                image,
                platform,
                code: token
            });
            return todo;
        } catch (error) {
            throw new Error('Failed to add todo');
        }
    }

    static async deleteTodo(name, token) {
        try {
            const todo = await Todo.findOne({
                where: {
                    name,
                    code: token
                }
            });
            await todo.destroy();
            return { message: 'Todo deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete todo');
        }
    }
}

module.exports = Todos;