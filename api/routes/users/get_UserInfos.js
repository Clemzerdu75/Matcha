const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');
const parseGallery = require('./picture/parse_gallery');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo:"${req.params.pseudo}"})  RETURN a`)
    .then((result) => {
      session.close();
      req.userInfos = {};
      if (result.records[0]) {
        req.userInfos = result.records[0].get('a').properties;
        if (req.userInfos.gallery !== undefined) {
          req.userInfos.gallery = parseGallery(req.userInfos.gallery);
        }
        const date = new Date(req.userInfos.lastConnect * 1);
        const stringDate = (Date.now() - req.userInfos.lastConnect) / 86400000 > 86400000
          ? `${Math.floor((Date.now() - req.userInfos.lastConnect) / 86400000)}Days ago`
          : `Today at ${date.getHours()}h${date.getMinutes()}`;
        req.userInfos.lastConnect = stringDate;
        req.userInfos.newNotification = req.userInfos.newNotification.low;
        delete req.userInfos.password;
        if (req.userTag) {
          req.userInfos.tags = req.userTag;
        }
        next();
      } else {
        next();
      }
    })
    .then(() => {
      next();
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
