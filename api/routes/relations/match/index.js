const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const fetch = require('node-fetch');
const deleteUserMatch = require('./delete_UserMatch');
const deleteUserLike = require('../like/delete_UserLike');
const getUserMatch = require('./get_UserMatch');
const addNotification = require('../../users/notification/update_Notification');
const allUserTags = require('../../tags/get_allUserTag');

models.get('/:pseudo', allUserTags, getUserMatch, (req, res) => {
  // debug(req.userLiked);
  res.status(200).send(req.allMatch);
});

models.delete('/delete', deleteUserMatch, deleteUserLike, (req, res) => {
  if (req.body.pseudo1 !== req.body.pseudo2) {
    fetch(`http://localhost:8080/user/${req.body.pseudo1}`, { headers: { authorization: process.env.BACK_TOKEN } })
      .then((resu) => resu.json())
      .then((resu) => {
        addNotification({
          title: 'Match deleted',
          sender: req.body.pseudo1,
          message: ' Just cancel his like :( !',
          photo: resu.gallery[0],
        }, req.body.pseudo2);
      })
      .then(() => res.status(200).send());
  } else {
    res.status(200).send();
  }
});
module.exports = models;
