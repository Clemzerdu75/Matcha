const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');

module.exports = ((req, res, next) => {
  if (!Array.isArray(req.User.tagsModification.newTags) || !req.User.tagsModification.newTags[0]) {
    next();
  } else {
    const session = driver.session();
    // debug(req.params.pseudo);
    const allPromises = req.User.tagsModification.newTags.map((elem) => new Promise((resolve, reject) => {
      session.run(
        `MATCH (a:TAG), (b:USER) WHERE b.pseudo = "${req.User.pseudo}" AND a.name = "${elem}" CREATE (b)-[:ENJOY]->(a) RETURN b`
      )
        .then(() => resolve())
        .catch((e) => reject(e));
    }));
    Promise.all(allPromises)
      .then(() => {
        debug(allPromises);
        session.close();
        next();
      })
      .catch((e) => {
        session.close();
        debug(e);
      });
  }
});
