const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo1}"}),
                      (b:USER {pseudo : "${req.body.pseudo2}"}) 
                MERGE (a)-[c:LIKE]->(b)
                ON CREATE set c.date = timestamp(), c.found = true
                  WITH c, c.found as result, a.popularity as currentPopA, b.popularity as currentPopB
                  REMOVE c.found
                RETURN result, currentPopA, currentPopB`)
    .then((result) => {
      session.close();
      if (!result.records[0]) {
        debug(new Error('Can\'t find user'));
        res.status(400).send('Can\'t find user');
      } else if (!result.records[0].get('result')) {
        debug(new Error('like relationship already exists'));
        res.status(200).send('like relationship already exists');
      } else {
        debug('ok');
        session.close();
        req.params.pseudo = req.body.pseudo1;
        req.userGetPoint = req.body.pseudo2;
        req.updatedPointB = Number.parseInt(result.records[0].get('currentPopB'), 10) + 5;
        req.updatedPointA = Number.parseInt(result.records[0].get('currentPopA'), 10) + 10;
        next();
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e.message);
    });
});
