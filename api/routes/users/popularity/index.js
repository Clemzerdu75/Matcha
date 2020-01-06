const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const getUserPopularity = require('./get_UserPopularity');
const getAllUserPopularity = require('./get_AllUserPopularity');
/*
** GET middlewares
*/

models.get('/all', getAllUserPopularity, (req, res) => {
  res.status(200).send(JSON.stringify(req.allUserPopularity));
});

models.get('/:pseudo', getUserPopularity, (req, res) => {
  res.status(200).send(JSON.stringify(req.userPopularity));
});

module.exports = models;
