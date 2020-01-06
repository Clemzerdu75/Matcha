const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');
const crypto = require('../../../config/hash');
const checkMessageFormat = require('./check_message');

module.exports = ((req, res, next) => {
  const session = driver.session();
  checkMessageFormat(req.body)
    .then((message) => {
      debug(message);
      session.run(`MATCH (a:USER {pseudo : "${req.body.sender}"}),
                      (b:USER {pseudo : "${req.body.dest}"})
                    MERGE (a)-[c:MESSAGE]-(b)
                  ON CREATE SET c.conversation = {message}, c.lastmessage = timestamp()
                  ON MATCH SET c.conversation = c.conversation + {message}, c.lastmessage = timestamp()
                RETURN c`, { message })
        .then((result) => {
          if (!result.records[0]) {
            session.close();
            debug(new Error('Problem updating conversation'));
            res.status(400).send('Problem updating conversation');
          } else {
            session.close();
            req.result = result.records[0].get('c').properties;
            debug('conversation updated');
            next();
          }
        })
        .catch((e) => {
          debug(e);
          res.status(400).send(e.message);
        });
    })
    .catch((e) => {
      debug(new Error('Problem updating conversation'));
      res.status(400).send(e.message);
    });
});
