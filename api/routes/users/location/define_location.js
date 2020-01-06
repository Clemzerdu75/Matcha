const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const geoip = require('geoip-lite');

module.exports = ((req, res, next) => {
  new Promise((resolve, reject) => {
    if (req.body.location.latitude === undefined || req.body.location.longitude === undefined) {
      const ip = '62.210.32.45';
      const geo = geoip.lookup(ip);
      if (geo.ll !== undefined) {
        resolve(geo);
      } else { reject(); }
    } else { resolve(); }
  })
    .then((result) => {
      if (result !== undefined) {
        [req.lat, req.lon] = result.ll;
        //debug(result);
      } else {
        req.lat = req.body.location.latitude;
        req.lon = req.body.location.longitude;
      }
      //debug(req.lon, req.lat);
      next();
    })
    .catch((e) => {
      debug(e);
      res.send(e);
    });
});
