const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const driver = require('../../config/database');
const newUser = require('./post_NewUser');
const checkUserInfos = require('./checkUserInfos');
const mailModel = require('./mail');
const passwordModel = require('./password');
const locationModel = require('./location');
const pseudoModel = require('./pseudo');
const getAllinfos = require('./get_AllUsersInfos');
const getUserInfos = require('./get_UserInfos');
const modifyUser = require('./modify_UserInfos');
const getAllUserTags = require('../tags/get_allUserTag');
const getUserTags = require('../tags/get_UserTag');
const deleteUser = require('./delete_User');
const popularityModel = require('./popularity');
const notificationModels = require('./notification');
const pictureModels = require('./picture');
const createUserTag = require('../tags/create_UserTag');
const deleteUserTag = require('../tags/delete_UserTag');
const updateGallery = require('./picture/update_Gallery');
const deletePicture = require('./picture/delete_Picture');
const sendMail = require('../../controller/sendmail');
const reportUser = require('./put_ReportUser');
const blockUser = require('../relations/block/create_BlockUser');
/*
** GET middlewares
*/

models.use('/mail', mailModel);
models.use('/password', passwordModel);
models.use('/pseudo', pseudoModel);
models.use('/popularity', popularityModel);
models.use('/location', locationModel);
models.use('/notification', notificationModels);
models.use('/picture', pictureModels);

/*
** GET middlewares
*/

models.get('/all', getAllUserTags, getAllinfos, (req, res) => {
  res.status(200).send(JSON.stringify(req.allInfos));
});

models.get('/:pseudo', getUserTags, getUserInfos, (req, res) => {
  res.status(200).send(JSON.stringify(req.userInfos));
});

models.put('/modify', checkUserInfos, updateGallery, deletePicture, createUserTag, deleteUserTag, modifyUser, (req, res) => {
  res.status(200).send(JSON.stringify(req.user));
});

models.delete('/delete', deleteUser, (req, res) => {
  res.status(200).send(JSON.stringify(`${req.body.pseudo} deleted`));
});

models.put('/disconnect', (req, res) => {
  const session = driver.session();
  debug('lol');
  session.run(`MATCH (a:USER {pseudo:"${req.body.pseudo}"})
              SET a.lastConnect = ${Date.now()}
  RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        debug(new Error('Cannot create user'));
      }
      debug(result.records[0].get('a'));
      req.user = result.records[0].get('a').properties;
      session.close();
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});

models.put('/report', reportUser, blockUser, deleteUser, (req, res) => {
  if (req.deleteUser === true) {
    sendMail(req.email,
      'Your account has been reported too many times\n We inform you that your account has been deleted it',
      'Matcha - Account Reported');
    res.status(200).send(JSON.stringify(req.reportCount));
  } else {
    sendMail(req.email,
      `Your account has been reported.\nWe inform you that if ${5 - req.reportCount} more users report your account, we'll delete it`,
      'Matcha - Account Reported');
    res.status(200).send(JSON.stringify(req.reportCount));
  }
});

module.exports = models;
