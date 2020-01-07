const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const fetch = require('node-fetch');
const createUserLike = require('./create_UserLike');
const createUserMatch = require('../match/create_UserMatch');
const deleteUserLike = require('./delete_UserLike');
const createConversation = require('../conversation/create_Conversation');
const whoUserLike = require('./get_WhoUserLike');
const whoLikeUser = require('./get_WhoLikeUser');
const updatePopularity = require('../../users/popularity/modify_UserPopularity');
const addNewNotifs = require('../../users/notification/update_Notification');
const allUserTags = require('../../tags/get_allUserTag');

models.post('/new', createUserLike, updatePopularity, whoLikeUser, createUserMatch, (req, res, next) => {
  /*
  ** We create the relation between user1-[:LIKE]->user2
  ** Then we look for the users who already like the user1
  ** If the user2 already have liked user1, we create a match relation
  */

  debug(req.updated);
  if (req.updated === true) {
    fetch(`http://localhost:8080/user/${req.body.pseudo1}`, { headers: { authorization: process.env.BACK_TOKEN } })
      .then((resu) => resu.json())
      .then((resu) => {
        addNewNotifs({
          title: 'New Match',
          sender: req.body.pseudo1,
          message: `You just match ${req.body.pseudo1} !`,
          photo: resu.gallery[0],
        }, req.body.pseudo2);
      })
      .then(() => fetch(`http://localhost:8080/user/${req.body.pseudo2}`, { headers: { authorization: process.env.BACK_TOKEN } }))
      .then((resu2) => resu2.json())
      .then((resu2) => addNewNotifs({
        title: 'New Match',
        sender: req.body.pseudo2,
        message: ' && you just match !',
        photo: resu2.gallery[0],
      }, req.body.pseudo1))
      .then(() => {
        debug('ok');
        res.status(200).send('Match created');
      })
      .catch((e) => {
        debug('bad');
        res.status(200).send(e.message);
      });
  } else {
    fetch(`http://localhost:8080/user/${req.body.pseudo1}`, { headers: { authorization: process.env.BACK_TOKEN } })
      .then((result) => result.json())
      .then((result) => {
        debug('addnotif like');
        addNewNotifs({
          title: 'New Like',
          sender: req.body.pseudo1,
          message: ' just likes you !',
          photo: result.gallery[0],
        }, req.body.pseudo2)
          .then(() => {
            res.status(200).send('Like created');
          })
          .catch((e) => {
            res.status(200).send(e);
          });
      });

  }
});

models.get('/userlike/:pseudo', allUserTags, whoUserLike, (req, res) => {
  // debug(req.allLike);
  res.status(200).send(req.allLike);
});

models.get('/likeuser/:pseudo', allUserTags, whoLikeUser, (req, res) => {
  // debug(req.allLike);
  res.status(200).send(req.allLike);
});

models.delete('/delete', deleteUserLike, (req, res) => {
  // debug(req.userLiked);
  res.status(200).send('ok');
});


module.exports = models;
