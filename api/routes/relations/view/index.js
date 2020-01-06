const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const fetch = require('node-fetch');
const addUserView = require('./add_UserView.js');
const getUserView = require('./get_userView');
const updatePopularity = require('../../users/popularity/modify_UserPopularity');
const addNotification = require('../../users/notification/update_Notification');


models.get('/:pseudo', getUserView, (req, res) => {
  // debug(req.userLiked);
  res.status(200).send(req.userViews);
});

models.post('/new', addUserView, (req, res) => {
  fetch(`http://localhost:8080/user/${req.body.viewer}`, { headers: { authorization: process.env.BACK_TOKEN } })
    .then((resu) => resu.json())
    .then((resu) => {
      debug(resu);
      addNotification({
        title: 'New View',
        sender: req.body.viewer,
        message: ' Just see your profil !',
        photo: resu.gallery[0],
      }, req.body.viewed)
        .then(() => res.status(200).send('point added'));
    });
});

module.exports = models;
