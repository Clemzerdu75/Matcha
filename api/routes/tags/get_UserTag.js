const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`MATCH (a), (b:USER) WHERE b.pseudo = "${req.params.pseudo}" AND (b)-[:ENJOY]->(a) RETURN a.type, a.name`)
    .then((result) => {
      session.close();
      req.userTag = [];
      if (result.records[0]) {
        result.records.forEach((record, i) => {
          req.userTag[i] = { name: record.get('a.name'), type: record.get('a.type') };
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
