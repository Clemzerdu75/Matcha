const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const getUserTags = require('./get_UserTag');
const newTag = require('./post_NewTag');
const checkTagInfos = require('./checkTagInfos');
const deleteUserTag = require('./delete_UserTag');
const createUserTag = require('./create_UserTag');
/*
** GET middlewares
*/

models.get('/:pseudo', getUserTags, (req, res) => {
  debug(req.userInfos);
  res.status(200).send(JSON.stringify(req.userTag));
});

/*
** POST middlewares
*/

models.post('/new', checkTagInfos, newTag, (req, res) => {
  debug(req.tag);
  res.status(200).send(JSON.stringify(req.tag));
});

models.put('/update', createUserTag, deleteUserTag, (req, res) => {
  res.status(200).send('ok');
});
module.exports = models;
