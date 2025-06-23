const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Game = require('../Fonctions/game.js');
const Users = require('../Fonctions/user.js');

router.use(express.json());

router.get('/game', async (req, res) => {
   try{
      res.json(await Game.getAllGames(req.query.page));
   } catch (error) {
      res.status(400).json({ erreur: error.message });
   }
});

router.get('/search', async (req, res) => {
   try{
      res.json(await Game.searchGames(req.query.game));
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

router.post('/add', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Users.addUser({ name, email, password });
    res.json(user);
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
}
);


module.exports = router;