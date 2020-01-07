const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  const popularity = parseInt(req.body.currentPopularity, 10) + 5;
  session.run(`MATCH (a:USER {pseudo:"${req.body.viewed}"}), (b:USER {pseudo:"${req.body.viewer}"})
        MERGE (b)-[c:VIEW]->(a)
        ON MATCH SET c.time = "${Date.now()}"
        ON CREATE SET c.time = "${Date.now()}", a.popularity = "${popularity}", c.found = true
        WITH c, c.found as result
        REMOVE c.found
        RETURN result`)
    .then((result) => {
      debug(result.records[0]);
      if (!result.records[0]) {
        res.status(400).send('Cannot find this user');
        debug(new Error('Cannot find this user'));
        return;
      }
      debug('je suis ici');
      session.close();
      next();
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);

    });
});
