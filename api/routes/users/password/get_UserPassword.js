const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  const resultPromise = session.run(`MATCH (a:USER {pseudo:"${req.params.pseudo}"})  RETURN a.password, a.pseudo`);
  resultPromise.then((result) => {
    if (!result.records[0]) {
      session.close();
      debug(new Error('Cannot find this user'));
      res.status(200).send('Cannot find this user');
    }
    req.userPassword = {};
    req.userPassword[result.records[0].get('a.pseudo')] = result.records[0].get('a.password');
    next();
  })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
