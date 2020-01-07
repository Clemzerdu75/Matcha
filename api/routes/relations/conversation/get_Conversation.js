const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const parseConv = require('./parse_Conversation');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.params.pseudo1}"}),
                      (b:USER {pseudo : "${req.params.pseudo2}"}),
                      (a)-[c:MESSAGE]-(b)
                    RETURN c.conversation as historic`)
    .then((result) => {
      session.close();
      req.result = [];
      if (result.records[0]) {
        parseConv(result.records[0].get('historic'))
          .then((messages) => {
            req.result = messages;
            next();
          })
          .catch((e) => {
            debug(e);
            res.status(400).send(e.messages);
          });
      } else {
        next();
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
