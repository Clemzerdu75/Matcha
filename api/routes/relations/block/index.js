const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const whoUserBlock = require('./get_WhoUserBlock');
const whoBlockUser = require('./get_WhoBlockUser');
const createUserBlock = require('./create_BlockUser');
const deleteUserBlock = require('./delete_UserBlock');

models.get('/userblock/:pseudo', whoUserBlock, (req, res) => {
  debug(req.allBlock);
  res.status(200).send(req.allBlock);
});

models.get('/blockuser/:pseudo', whoBlockUser, (req, res) => {
  debug(req.userLiked);
  res.status(200).send(req.allBlock);
});

models.post('/new', createUserBlock, (req, res) => {
  res.status(200).send('block created');
});

models.delete('/delete', deleteUserBlock, (req, res) => {
  debug(req.userLiked);
  res.status(200).send('ok');
});

module.exports = models;
