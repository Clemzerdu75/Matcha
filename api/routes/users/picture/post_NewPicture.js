const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const fs = require('fs');
const driver = require('../../../config/database');
const crypto = require('../../../config/hash');

module.exports = ((req, res, next) => {
  debug(Object.keys(req.body.data));
  debug(req.body.data.newPic);
  let base64Data = req.body.data.newPic.replace(/^data:image\/png;base64,/, '');
  base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, '');
  const random = Math.floor(Math.random() * 10000000);
  const imgPath = `http://localhost:8080/${random}-${Date.now()}.${req.body.data.type}`;
  const imgSave = `./public/${random}-${Date.now()}.${req.body.data.type}`;
  fs.writeFile(imgSave, base64Data, 'base64', (err) => {
    if (err) {
      console.log(err);
    } else {
      const session = driver.session();
      session.run(`MATCH (a:USER {pseudo : "${req.body.data.pseudo}"})
                  SET a.gallery = a.gallery + " ${imgPath} "
                RETURN a`)
        .then((result) => {
          session.close();
          if (!result.records[0]) {
            debug(new Error('Cannot create user'));
            next();
          } else {
            debug(result.records[0].get('a'));
            req.newPic = imgPath;
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
});
