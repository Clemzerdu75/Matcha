const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');
const crypto = require('../../config/hash');
const createValidationToken = require('../../controller/createValidationToken');
const sendMail = require('../../controller/sendmail');


module.exports = ((req, res, next) => {
  const session = driver.session();
  debug(typeof req.body.password);
  session.run(`CREATE (a:USER {
    name: "${req.body.name}",
    lastname:"${req.body.lastname}",
    pseudo:"${req.body.pseudo}",
    gender:"${req.body.gender}",
    orientation:"${req.body.sexOrientation}",
    popularity: "5",
    description:" ",
    country:"${req.body.region}",
    age:" ",
    birthday:" ",
    email:"${req.body.email}",
    views: "",
    userStatus:"user",
    accountStatus: "registered",
    password:"${crypto.hash(req.body.password)}",
    gallery: " ",
    notification: "",
    newNotification: 0,
    lat: "", 
    lon: "", 
    city: "", 
    postal: "",
    reportCount: 0
    }) RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        debug(new Error('Cannot create user'));
        res.status(200).send('error');
      } else {
        debug(result.records[0].get('a'));
        req.user = result.records[0].get('a').properties;
        session.close();
        createValidationToken(req.body.pseudo)
          .then((token) => {
            req.user.token = token;
            debug(token);
          })
          .then(() => {
            next();
            debug(req.user.email);
            sendMail(req.user.email,
              `<p> Hello ${req.body.pseudo}! Welcome on Matcha.\nClick <a href="http://localhost:3000/ValidateAccount?token=${req.user.token}&pseudo=${req.body.pseudo}">here</a> to Activate your account</p>`,
              'Validate Matcha Account');
          });
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(200).send('failure');
    });
});
