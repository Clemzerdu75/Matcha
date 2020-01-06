const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  debug('getAllMail');
  session.run('MATCH (a:USER) RETURN a.email, a.pseudo')
    .then((result) => {
      session.close();
      req.allMail = [];
      if (result.records[0]) {
        result.records.forEach((record, i) => {
          req.allMail[i] = { pseudo: record.get('a.pseudo'), mail: record.get('a.email') };
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
