const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const checkNotifFormat = require('./check_Notification');


module.exports = ((newNotification, pseudo) => new Promise((resolve, reject) => {
  const session = driver.session();
  debug(pseudo);
  checkNotifFormat(newNotification, pseudo)
    .then((notif) => {
      session.run(`MATCH (a:USER {pseudo : "${pseudo}"})
                  SET a.notification = a.notification + "${notif}",
                  a.newNotification = a.newNotification + 1
                RETURN a`)
        .then((result) => {
          if (!result.records[0]) {
            debug(pseudo, notif, result);
            session.close();
            debug(new Error('Problem adding notification'));
            reject(new Error('Problem adding notification'));
          } else {
            session.close();
            resolve();
          }
        })
        .catch((e) => {
          debug(e);
          reject(new Error('Problem adding notification'));
        });
    })
    .catch((e) => {
      debug(new Error('Problem updating notification'));
      reject(new Error('Problem adding notification'));
    });
}));
