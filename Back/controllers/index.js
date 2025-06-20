const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Game = require('../Fonctions/game.js');

router.use(express.json());

router.get('/game', async (req, res) => {
   res.json(await Game.getAllGames(req.query.page));
});

router.get('/search', async (req, res) => {
   res.json(await Game.searchGames(req.query.game));
});

module.exports = router;