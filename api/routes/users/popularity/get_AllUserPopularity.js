const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  const resultPromise = session.run('MATCH (a:USER)  RETURN a.popularity, a.pseudo');
  resultPromise.then((result) => {
    session.close();
    req.allUserPopularity = {};
    if (result.records[0]) {
      result.records.forEach((record, i) => {
        const userPoints = parseInt(record.get('a.popularity'), 10);
        req.allUserPopularity[record.get('a.pseudo')] = Math.floor(userPoints);
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
