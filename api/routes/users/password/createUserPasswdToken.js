const crypto = require('crypto');
const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = (email) => new Promise((resolve, reject) => {
  crypto.randomBytes(48, (err, buffer) => {
    const token = buffer.toString('hex');
    const session = driver.session();
    session.run(`MATCH (a:USER {email : {email}})
      SET a.resetPasswdToken = {token} RETURN a.resetPasswdToken`, {
      token,
      email,
    })
      .then((result) => {
        session.close();
        if (!result.records[0]) {
          session.close();
          debug(new Error('couldn\'t find user'));
        } else {
          resolve(token);
        }
      })
      .catch((e) => {
        reject();
      });
  });
});
