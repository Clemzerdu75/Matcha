const googleMapsClient = require('@google/maps').createClient({ key: process.env.GOOGLE_KEY });
const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = ((req, res, next) => {
  new Promise((resolve, reject) => {
    googleMapsClient.reverseGeocode({
      latlng: [req.lat, req.lon],
      result_type: 'postal_code',
    }, (err, response) => {
      if (err !== null) { res.status(400).send(err); }
      req.adress = response.json.results[0].formatted_address;
      //debug(response.json.results[0].address_components);
      response.json.results[0].address_components.forEach((element) => {
        if (element.types[0] === 'locality') { req.city = element.short_name; }
        if (element.types[0] === 'postal_code') { req.postalCode = element.short_name; }
        if (req.city && req.postalCode) { resolve(); }
      });
      reject();
    });
  })
    .then(() => {
      //debug(req.postalCode, req.city, req.lat, req.lon);
      next();
    })
    .catch((e) => {
      debug(e);
      res.send('can\'t locate user');
    });
});
