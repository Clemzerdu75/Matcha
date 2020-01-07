const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const getAllPseudo = require('./get_AllPseudo');
const checkToken = require('../../../config/checkToken');
/*
** GET middlewares
*/

models.get('/all', getAllPseudo, (req, res) => {
  debug(req.auth);
  res.status(200).send(JSON.stringify(req.allPseudo));
});

/*
** POST middlewares
*/

module.exports = models;
