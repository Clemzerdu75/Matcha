const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo :"${req.body.user}"})
  SET
    a.lat = "${req.lat}",
    a.lon = "${req.lon}",
    a.city = "${req.city}",
    a.postal = "${req.postalCode}"
    RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        debug(result);
        debug(new Error('Cannot set user Location'));
      }
      req.user = result.records[0].get('a').properties;
      session.close();
      next();
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
