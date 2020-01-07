const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const parseGallery = require('../../users/picture/parse_gallery');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.params.pseudo}"}), (b:USER)
                WHERE (b)-[:MATCH]-(a) AND NOT (b)-[:BLOCK]-(a)   
                RETURN b`)
    .then((result) => {
      session.close();
      req.allMatch = [];
      if (result.records[0]) {
        result.records.forEach((record, i) => {
          req.allMatch[i] = record.get('b').properties;
          const date = new Date(record.get('b').properties.lastConnect * 1);
          const stringDate = (Date.now() - record.get('b').properties.lastConnect) / 86400000 > 86400000
            ? `${Math.floor((Date.now() - record.get('b').properties.lastConnect) / 86400000)}Days ago`
            : `Today at ${date.getHours()}h${date.getMinutes()}`;
          req.allMatch[i] = record.get('b').properties;
          req.allMatch[i].lastConnect = stringDate;
          req.allMatch[i].tags = req.allUserTag[req.allMatch[i].pseudo];
          delete req.allMatch[i].password;
          req.allMatch[i].gallery = parseGallery(req.allMatch[i].gallery);
        });
        session.close();
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
