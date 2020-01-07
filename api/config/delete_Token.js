const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('./database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo}"})
  SET a.token = ""
  RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        session.close();
        debug(new Error('Cannot delete token'));
        res.status(400).send('Cannot delete token');
      } else {
        session.close();
        res.status(200).send(`auth Token deleted for ${req.result.user}`);
        debug(`auth Token deleted for ${req.result.user}`);
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e.message);
    });
});
