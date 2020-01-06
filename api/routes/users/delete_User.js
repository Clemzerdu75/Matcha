const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  if (req.deleteUser === false) {
    next();
  } else {
    session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo}"})
    DETACH DELETE a
                  RETURN a`)
      .then((result) => {
        if (!result.records[0]) {
          session.close();
          debug(new Error('couldn\'t find match'));
          res.status(400).send('couldn\'t find match');
        } else {
          session.close();
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
