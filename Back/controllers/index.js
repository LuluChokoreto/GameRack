const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Games = require('../Fonctions/game.js');
const Users = require('../Fonctions/user.js');
const DevGame = require('../Fonctions/devGame.js');

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
      const name = req.query.game ?? null;
      const platform = req.query.platform ?? null;
      const date = req.query.date ?? null;
      res.json(await Games.searchGames(name, platform, date));
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

router.get('/best', async (req, res) => {
   try {
      res.json(await Games.getBestGames());
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
      res.json(await DevGame.getAllDevGames());
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.get('/userGame', async (req, res)=> {
   try {
      const decodedToken = jwt.verify(req.query.token, process.env.JWTSECRET);
      const { code } = decodedToken;
      res.json(await Games.getUserGames(code));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
      
   }
})

router.get('/review', async (req, res) => {
   try {
      res.json(await Games.getAllReview())
   } catch (error) {
      res.status(400).json({erreur: error.message})

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
    const { name, token } = await Users.loginUser({ email, password });
    res.json({user:name,token});
  } catch (error) {
    res.status(400).json({ erreur: error.message });
   }
});

router.post('/addGame', async (req, res) => {
  try {
    const { name, image, rating, platform, review, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const game = await Games.addFinishGame({ name, image, rating, platform, review, token:decodedToken.code });
    res.json(game);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});

router.post('/addWish', async (req, res) => {
   try {
      const { name, image, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const wish = await Games.addWish({ name, image, rating,  token: decodedToken.code });
      res.json(wish);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.post('/addTodo', async (req, res) => {
   try {
      const { name, image, platform, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const todo = await Games.addTodo({ name, image, platform, token: decodedToken.code });
      res.json(todo);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
      
   }
})

router.post('/deleteGame', async (req, res) => {
  try {
    const { name, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const game = await Games.deleteGame(name, decodedToken.code);
    res.json(game);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});

router.post('/deleteWish', async (req, res) => {
   try {
      const { name, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const wish = await Wishes.deleteWish(name, decodedToken.code);
      res.json(wish);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.post('/deleteTodo', async (req, res) => {
   try {
      const { name, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const todo = await Todos.deleteTodo(name, decodedToken.code);
      res.json(todo);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.post('/deleteReview', async (req, res) => {
   try {
      const { name, review, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      if(decodedToken.role !== 'admin') {
         throw new Error('Unauthorized action');
      }
      const game = await Games.deleteReview(name, review);
      res.json(game);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

//router Update
router.put('/updateStatus', async (req,res)=> {
   try {
      const { name, status, rating, platform, review, token } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const game = await Games.updateStatus({
         name,
         status,
         rating,
         platform,
         review,
         token: decodedToken.code
      });
      res.json(game);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
})

router.put('/updateRole', async (req, res) => {
   try {
      const { email, role } = req.body;
      const user = await Users.updateRole(email);
      res.json(user);
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});



module.exports = router;