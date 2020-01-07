const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const checkToken = require('../../../config/checkToken');
const NewPicture = require('./post_NewPicture');
/*
** GET middlewares
*/

models.post('/new', NewPicture, (req, res) => {
  res.status(200).send(req.newPic);
});

/*
** POST middlewares
*/

module.exports = models;
