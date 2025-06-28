const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Games = require('../Fonctions/game.js');
const Users = require('../Fonctions/user.js');
const Wishes = require('../Fonctions/wish.js');
const Todos = require('../Fonctions/todo.js');

router.use(express.json());

//route Get RAWG
router.get('/game', async (req, res) => {
   try{
      res.json(await Games.getAllGames(req.query.page));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.get('/search', async (req, res) => {
   try{
      res.json(await Games.searchGames(req.query.game));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.get('/random', async (req, res) => {
   try {
      const games = await Games.getRandomGame();
      res.json(games);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});



router.get("/specificGame", async (req, res) => {
   try {
      res.json(await Games.getSpecificGame(req.query.id));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
      
   }
})

router.get('/comingSoon', async (req, res) => {
   try {
      res.json(await Games.getComingSoonGames());
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.get('/filter', async (req, res) => {
   try {
      const {platform, date}=req.query;
      res.json(await Games.filterGames(platform, date));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.get('/platform', async (req, res) => {
   try {
      res.json(await Games.getAllPlatforms());
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})



//route Get Your Api
router.get('/devGame', async (req, res) => {
   try {
      res.json(await Games.getAllDevGames());
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.get('/wish', async (req,res) =>{
   try {
      res.json(await Wishes.getAllWishes(req.query.token));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.get('/todo', async (req, res) => {
   try {
      res.json(await Todos.getAllTodos(req.query.token));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

//route Post
router.post('/add', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await Users.addUser({ name, email, password, role });
    res.json(user);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  } 
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await Users.loginUser({ email, password });
    res.json(token);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
   }
});

router.post('/addGame', async (req, res) => {
  try {
    const { name, image, rating, platform, review, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const game = await Games.addFinishGame({ name, image, rating, platform, review, token: decodedToken });
    res.json(game);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});

router.post('/deleteGame', async (req, res) => {
  try {
    const { name, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const game = await Games.deleteGame(name, decodedToken);
    res.json(game);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});

router.post('/addWish', async (req, res) => {
   try {
      const { name, image, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const wish = await Wishes.addWish({ name, image, token: decodedToken });
      res.json(wish);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.post('/deleteWish', async (req, res) => {
   try {
      const { name, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const wish = await Wishes.deleteWish(name, decodedToken);
      res.json(wish);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.post('/addTodo', async (req, res) => {
   try {
      const { name, image, platform, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const todo = await Todos.addTodo({ name, image, platform, decodedToken });
      res.json(todo);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
      
   }
})

router.post('/deleteTodo', async (req, res) => {
   try {
      const { name, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const todo = await Todos.deleteTodo(name, decodedToken);
      res.json(todo);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

module.exports = router;