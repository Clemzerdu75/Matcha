const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const parseNotif = require('./parse_Notification');


module.exports = ((req, res, next) => {
  const session = driver.session();
  debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo : "${req.params.pseudo}"})
              SET a.newNotification = 0
                    RETURN a.notification as notifications`)
    .then((result) => {
      if (!result.records[0]) {
        session.close();
        res.status(200).send({});
      } else {
        session.close();
        if (result.records[0].get('notifications') === null) {
          res.status(200).send({});
        } else {
          parseNotif(result.records[0].get('notifications'))
            .then((notif) => {
              req.result = notif;
              next();
            })
            .catch((e) => {
              debug(e);
              res.status(400).send(e.messages);
            });
        }
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
