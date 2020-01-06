const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');

module.exports = ((req, res, next) => {

  debug(req.User.tagsModification.deleteTags);
  if (!Array.isArray(req.User.tagsModification.deleteTags) || !req.User.tagsModification.deleteTags[0]) {
    debug('nop');
    next();
  } else {
    const session = driver.session();
    // debug(req.params.pseudo);
    const allPromises = req.User.tagsModification.deleteTags.map((elem) => new Promise((resolve, reject) => {
      session.run(
        `MATCH (a:TAG), (b:USER), (b)-[c:ENJOY]->(a) WHERE b.pseudo = "${req.User.pseudo}" AND a.name = "${elem}" DELETE c RETURN a`
      )
        .then(() => resolve())
        .catch((e) => reject(e));
    }));
    Promise.all(allPromises)
      .then(() => {
        debug('lol');
        session.close();
        next();
      })
      .catch((e) => {
        session.close();
        debug(e);
      });
  }
});
