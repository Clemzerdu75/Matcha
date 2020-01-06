const neo4j = require('neo4j-driver').v1;
const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');

module.exports = () => new Promise((resolve, reject) => {

  const session = driver.session();
  Promise.all([
    session.run('CREATE CONSTRAINT ON (USER:USER) ASSERT USER.email IS UNIQUE'),
    session.run('CREATE CONSTRAINT ON (USER:USER) ASSERT USER.pseudo IS UNIQUE'),
    session.run('CREATE CONSTRAINT ON (TAG:TAG) ASSERT TAG.name IS UNIQUE'),
  ])
    .then(() => {
      session.close(() => {
        console.log('DB constraints created');
        resolve();
      });
    })
    .catch((e) => {
      session.close();
      console.log(e);
    });
});
