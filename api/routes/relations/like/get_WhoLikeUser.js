const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const parseGallery = require('../../users/picture/parse_gallery');

module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.params.pseudo}"}), (b:USER)
                WHERE (b)-[:LIKE]->(a) AND NOT (b)-[:BLOCK]-(a)
                RETURN b`)
    .then((result) => {
      session.close();
      req.allLike = [];
      if (result.records[0] && req.body.pseudo2) {
        result.records.forEach((record) => {
          if (record.get('b').properties.pseudo === req.body.pseudo2) {
            debug(record.get('b').properties.pseudo);
            req.allLike[0] = record.get('b').properties;
            delete req.allLike[0].password;
          }
        });
        debug('the end');
        session.close();
        next();
      } else if (result.records[0]) {
        result.records.forEach((record, i) => {
          debug(record.get('b').properties);
          const date = new Date(record.get('b').properties.lastConnect * 1);
          const stringDate = (Date.now() - record.get('b').properties.lastConnect) / 86400000 > 86400000
            ? `${Math.floor((Date.now() - record.get('b').properties.lastConnect) / 86400000)}Days ago`
            : `Today at ${date.getHours()}h${date.getMinutes()}`;
          req.allLike[i] = record.get('b').properties;
          req.allLike[i].lastConnect = stringDate;
          req.allLike[i].tags = req.allUserTag[req.allLike[i].pseudo];
          req.allLike[i].gallery = parseGallery(req.allLike[i].gallery);
          delete req.allLike[0].password;
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
