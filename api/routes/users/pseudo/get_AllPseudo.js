const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run('MATCH (a:USER) RETURN a.pseudo')
    .then((result) => {
      session.close();
      req.allPseudo = [];
      if (result.records[0]) {
        result.records.forEach((record, i) => {
          req.allPseudo[i] = record.get('a.pseudo');
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
