const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('./database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.result.pseudo}"})
  SET a.token = "${req.result.token}"
  RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        debug(result);
        session.close();
        debug(new Error('Couldn\'t find user'));
        res.status(500).send('Couldn\'t find user');
      } else {
        session.close();
        next();
        debug(`auth Token created for ${req.result.pseudo} : ${req.result.token}`);
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e.message);
    });
});
