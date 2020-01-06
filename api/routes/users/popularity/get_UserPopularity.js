const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo:"${req.params.pseudo}"})  RETURN a.popularity, a.pseudo`)
    .then((result) => {
      req.userPopularity = {};
      if (result.records[0]) {
        const userPoints = parseInt(result.records[0].get('a.popularity'), 10);
        req.userPopularity[result.records[0].get('a.pseudo')] = Math.floor(userPoints);
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
