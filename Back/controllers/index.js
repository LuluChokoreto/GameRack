const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Games = require('../Fonctions/game.js');
const Users = require('../Fonctions/user.js');

router.use(express.json());


//route Get
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

router.get('/user', async (req, res) => {
    try {
    const user = await Users.getAllUsers();
    res.json(user);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});


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

router.post('/addgame', async (req, res) => {
  try {
    const { name, image, rating, platform, review, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    console.log(decodedToken);
    const game = await Games.addFinishGame({ name, image, rating, platform, review, token: decodedToken });
    res.json(game);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
});

module.exports = router;