const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  if (Number.isInteger(req.updatedPoint === false)) {
    res.status(500).send('Internal servor error');
  } else if (!req.userGetPoint) {
    res.status(400).send('Internal servor error');
  } else {
    session.run(`MATCH (a:USER {pseudo :"${req.userGetPoint}"})
    SET a.popularity = "${req.updatedPointB}" RETURN a`)
      .then((result) => {
        session.close();
        req.updatedPoints = {};
        if (result.records[0]) {
          req.updatedPoints[result.records[0].get('a').properties.pseudo] = result.records[0].get('a').properties;
          debug('ok');
          next();
        } else {
          debug('pas ok');
          next();
        }
        
      })
      .catch((e) => {
        session.close();
        debug(new Error(e));
        res.status(400).send(e);
      });
  }
});
