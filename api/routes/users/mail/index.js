const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const getAllMail = require('./get_AllMail');
/*
** GET middlewares
*/

models.get('/all', getAllMail, (req, res) => {
  // debug(req.allMail);
  res.status(200).send(JSON.stringify(req.allMail));
});

/*
** POST middlewares
*/

module.exports = models;
