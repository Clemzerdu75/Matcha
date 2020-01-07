const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const getUserPassword = require('./get_UserPassword');
/*
** GET middlewares
*/

models.get('/:pseudo', getUserPassword, (req, res) => {
  debug(req.userPassword);
  res.status(200).send(JSON.stringify(req.userPassword));
});

/*
** POST middlewares
*/

module.exports = models;
