const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');
const parseGallery = require('./picture/parse_gallery');


module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  const resultPromise = session.run('MATCH (a:USER) RETURN a');
  resultPromise.then((result) => {
    session.close();
    req.allInfos = [];
    if (result.records[0]) {
      result.records.forEach((record, i) => {
        req.allInfos[i] = record.get('a').properties;
        delete req.allInfos[i].password;
        req.allInfos[i].gallery = parseGallery(req.allInfos[i].gallery);
        if (record.get('a').properties.pseudo in req.allUserTag) {
          req.allInfos[i].tags = req.allUserTag[record.get('a').properties.pseudo];
        }
        const date = new Date(req.allInfos[i].lastConnect * 1);
        const stringDate = (Date.now() - req.allInfos[i].lastConnect) / 86400000 > 86400000
          ? `${Math.floor((Date.now() - req.allInfos[i].lastConnect) / 86400000)}Days ago`
          : `Today at ${date.getHours()}h${date.getMinutes()}`;
        req.allInfos[i].lastConnect = stringDate;
        req.allInfos[i].newNotification = req.allInfos[i].newNotification.low;
      });
      next();
    } else {
      next();
    }
  })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
