const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {

  req.updatedPointB += 10;
  req.updated = false;
  if (!req.allLike[0]) {
    debug('pas la alllike');
    next();
  } else if (req.allLike[0].pseudo === req.body.pseudo2) {
    debug('there');
    debug('Relation créé, match en cours de creation');
    const session = driver.session();
    session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo1}"}),
                          (b:USER {pseudo : "${req.body.pseudo2}"}) 
                    MERGE (a)-[c:MATCH]->(b)
                    ON CREATE set c.date = timestamp(), c.found = true, a.popularity = "${req.updatedPointA}", b.popularity = "${req.updatedPointB}"
                    WITH c, c.found as result, b.popularity as currentPop
                    REMOVE c.found
                    RETURN result , currentPop`)
      .then((result) => {
        debug(result.records[0].get('result'));
        if (!result.records[0]) {
          session.close();
          debug(new Error('Can\'t find user'));
          res.status(400).send('Can\'t find user');
        } else if (!result.records[0].get('result')) {
          debug('ici');
          session.close();
          debug(new Error('match already exists'));
          res.status(400).send('match already exists');
        } else {
          req.updated = true;
          next();
        }
      })
      .catch((e) => {
        session.close();
        debug(new Error(e));
        res.status(400).send(e);
      });
  }
});
