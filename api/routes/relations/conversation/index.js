const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const fetch = require('node-fetch');
const getConversation = require('./get_Conversation');
const modifyConversation = require('./modify_Conversation');
const addNotification = require('../../users/notification/update_Notification');
// const deleteConversation = require('./delete_Conversation');


models.get('/:pseudo1/:pseudo2', getConversation, (req, res) => {
  res.status(200).send(req.result);
});

models.put('/update', modifyConversation, (req, res) => {
  if (req.body.sender !== req.body.dest) {
    debug(process.env.BACK_TOKEN);
    fetch(`http://localhost:8080/user/${req.body.sender}`, { headers: { authorization: process.env.BACK_TOKEN } })
      .then((resu) => resu.json())
      .then((resu) => {
        debug('index');
        addNotification({
          title: 'New Message',
          sender: req.body.sender,
          message: ' Just sent you a message !',
          photo: resu.gallery[0],
        }, req.body.dest);
      })
      .then(() => res.status(200).send());
  } else {
    res.status(200).send();
  }
  res.status(200).send(req.result);
});

module.exports = models;
