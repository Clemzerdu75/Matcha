const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const crypto = require('../../../config/hash');
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  const newPasswd = crypto.hash(req.body.password);
  debug(newPasswd);
  session.run(`MATCH (a:USER {email : {email}, resetPasswdToken : {token}})
      SET a.password = {newPasswd},
      a.resetPasswdToken = ""
    RETURN a`, {
    email: req.body.email,
    token: req.body.token,
    newPasswd,
  })
    .then((result) => {
      session.close();
      if (!result.records[0]) {
        res.status(200).send('Bad Token or Mail');
      } else {
        next();
      }
    })
    .catch((e) => {
      debug(e);
      res.status(200).send('An error occured');
    });
});
