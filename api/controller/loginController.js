const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const jwt = require('jsonwebtoken');
const driver = require('../config/database');
const checkInfos = require('../config/regex');
const hash = require('../config/hash');


module.exports = (req, res, next) => {
  req.loginInfo = {
    password: req.body.password,
    login: req.body.login,
  };
  if (req.loginInfo.password && req.loginInfo.login) {
    Promise.all([
      checkInfos.checkmail(req.loginInfo.login),
      checkInfos.checkpassword(req.loginInfo.password),
    ])
      .then(() => {
        const session = driver.session();
        session.run(`MATCH (a:USER) 
                      WHERE a.email = '${req.loginInfo.login}' AND
                      a.password = '${hash.hash(req.loginInfo.password)}' 
                      SET a.lastConnect = '${Date.now()}'
                      RETURN a, a.pseudo, a.accountStatus`)
          .then((result) => {
            if (!result.records[0]) {
              debug(result);
              session.close();
              res.status(200).send('Login Error, bad infos');
              return false;
            }
            return result;
          })
          .then((result) => {
            if (result !== false) {
              debug(result.records[0].get('a.accountStatus'));
              if (result.records[0].get('a.accountStatus') === 'validated' || result.records[0].get('a.accountStatus') === 'completed') {
                const payload = { pseudo: result.records[0].get('a.pseudo') };
                const options = { expiresIn: '2d', issuer: 'DoctorLove' };
                const secret = process.env.JWT_SECRET;
                req.result = { token: jwt.sign(payload, secret, options), status: 200, pseudo: result.records[0].get('a.pseudo') };
                next();
              } else {
                debug('lol');
                debug(result.records[0].get('a.accountStatus'));
                res.status(200).send('Please confirm your account to log in');
              }
            }
          })
          .catch((e) => {
            session.close();
            debug(e);
            res.status(600).send(e);
            return (e);
          });

      })
      .catch((e) => {
        debug(e);
        res.status(200).send(e.message);
        return (e);
      });
  } else {
    res.status(400).send('Missing information');
  }
};
