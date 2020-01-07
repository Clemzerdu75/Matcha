const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo1}"}),
                      (b:USER {pseudo : "${req.body.pseudo2}"}) 
                MERGE (a)-[c:MESSAGE]->(b)
                ON CREATE set c.date = timestamp()
                RETURN a, b ,c`)
    .then((result) => {
      if (!result.records[0]) {
        session.close();
        debug(new Error('Can\'t find user'));
        res.status(400).send('Can\'t find user');
      } else if (!result.records[0].get('c')) {
        session.close();
        debug(new Error('Message relationship already exists'));
        res.status(400).send('Message relationship already exists');
      } else {
        session.close();
        res.status(200).send(`You just matched ${req.body.pseudo2}`);
        debug(`${req.body.pseudo1}You just matched ${req.body.pseudo2}`);
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e.message);
    });
});
