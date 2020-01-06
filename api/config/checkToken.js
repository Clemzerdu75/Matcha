const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const jwt = require('jsonwebtoken');
const driver = require('../config/database');


module.exports = ((req, res, next) => {
  //debug('jesuisla');
  if (!req.headers.authorization) {
    debug('error');
    res.status(200).send('you have to log in to access this ressource');
  } else if (req.headers.authorization === process.env.BACK_TOKEN) {
    debug('i am back');
    //debug(req.headers);
    next();
  } else if (!req.headers.referer || !req.headers.referer.match(/^http:\/\/localhost:3000/)) {
    debug('bad referer, rejected');
    res.status(200).send('bad referer, rejected');
  } else {
    debug('i am front');
    //debug(req.headers.referer);
    const bearerToken = req.headers.authorization;
    const decodedToken = jwt.decode(bearerToken.split(' ')[1]);
    if (decodedToken && bearerToken.split(' ').length === 2 && bearerToken.split(' ')[0] === 'Bearer') {
      if (decodedToken.exp >= Date.now()) {
        debug(new Error('Token expired'));
        res.status(400).send('Token expired');
      } else {
        const token = bearerToken.split(' ')[1];
        const session = driver.session();
        session.run(`MATCH (a:USER {token : "${token}"})
                      RETURN a.pseudo, a.mail`)
          .then((result) => {
            if (!result.records[0]) {
              session.close();
              debug(new Error('Bad authentification'));
              res.status(200).send('Bad authentification');
            } else {
              session.close();
              req.auth = decodedToken;
              debug(`User ${result.records[0].get('a.pseudo')} logged in`);
              debug(`decoded token = ${JSON.stringify(decodedToken)}`);
              next();
            }
          })
          .catch((e) => {
            session.close();
            debug(new Error(e));
            res.status(400).send(e);
          });
      }
    } else {
      debug(new Error('Bad token'));
      res.status(200).send('Bad token');
    }
  }
});
