const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  if (!Array.isArray(req.User.gallery)) {
    next();
  } else if (!req.User.gallery[0]) {
    debug(req.User.gallery);
    session.run(`MATCH (a:USER {pseudo : "${req.User.pseudo}"})
    SET a.gallery = ""
    RETURN a`)
      .then((result) => {
        session.close();
        next();
      })
      .catch((e) => {
        session.close();
        debug(new Error(e));
        res.status(400).send(e);
      });
  } else {
    session.run(`MATCH (a:USER {pseudo : "${req.User.pseudo}"})
              SET a.gallery = "${req.User.gallery.join(' ')}"
              RETURN a`)
      .then((result) => {
        session.close();
        next();
      })
      .catch((e) => {
        session.close();
        debug(new Error(e));
        res.status(400).send(e);
      });
  }
});
