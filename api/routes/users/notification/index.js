const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const fetch = require('node-fetch');
const getNotification = require('./get_Notification');
const addNotification = require('./update_Notification');

// const deleteConversation = require('./delete_Conversation');

models.get('/:pseudo', getNotification, (req, res) => {
  res.status(200).send(req.result);
});

models.put('/add', (req, res) => {
  res.status(200).send();
});


module.exports = models;
