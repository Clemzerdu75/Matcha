const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const parseGallery = require('../../users/picture/parse_gallery');

module.exports = ((req, res, next) => {
  const session = driver.session();
  debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo:"${req.params.pseudo}"}),
    (b)-[c:VIEW]->(a)
  RETURN b.pseudo, b.gallery, c.time`)
    .then((result) => {
      session.close();
      req.allViews = [];
      if (!result.records[0]) {
        res.status(200).send([]);
      } else {
        result.records.forEach((user, i) => {
          const date = new Date(user.get('c.time') * 1);
          debug(date, Date.now());
          const stringDate = (Date.now() - user.get('c.time')) / 86400000 > 86400000
            ? `${Math.floor((Date.now() - user.get('c.time')) / 86400000)}Days ago`
            : `Today at ${date.getHours()}h${date.getMinutes()}`;
          debug(date);
          req.allViews[i] = {
            pseudo: user.get('b.pseudo'),
            picture: parseGallery(user.get('b.gallery'))[0],
            date: stringDate,
          };
        });
      }
      res.status(200).send(req.allViews);
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
