const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const checkUserInfos = require('../../config/regex');

function userHasAllInfos(User) {
  debug(User.completed);
  if (Object.prototype.hasOwnProperty.call(User, 'name')
    && Object.prototype.hasOwnProperty.call(User, 'lastname')
    && Object.prototype.hasOwnProperty.call(User, 'pseudo')
    && Object.prototype.hasOwnProperty.call(User, 'email')
    && Object.prototype.hasOwnProperty.call(User, 'tagsModification')
    && Object.prototype.hasOwnProperty.call(User, 'gallery')
    && Object.prototype.hasOwnProperty.call(User.tagsModification, 'newTags')
    && Object.prototype.hasOwnProperty.call(User.tagsModification, 'deleteTags')) return true;
    //&& Object.prototype.hasOwnProperty.call(User, 'password')
    //&& Object.prototype.hasOwnProperty.call(User, 'gender')
    //&& Object.prototype.hasOwnProperty.call(User, 'orientation')) 
  return false;
}

module.exports = ((req, res, next) => {
  req.User = req.body.data ? req.body.data : req.body;
  const error = [];
  if (!userHasAllInfos(req.User)) {
    debug('missing info');
    res.status(400).send('Missing infos');
    return;
  }
  Promise.all([
    checkUserInfos.checkname(req.User.name),
    checkUserInfos.checklastname(req.User.lastname),
    checkUserInfos.checkpseudo(req.User.pseudo),
    checkUserInfos.checkmail(req.User.email)])
    //checkUserInfos.checkpassword(User.password),
    //checkUserInfos.checkgender(User.gender),
    //checkUserInfos.checkorientation(User.orientation)
    .then(() => {
      next();
    })
    .catch((e) => {
      debug(e.message);
      res.status(400).send(e.message);
    });
});
