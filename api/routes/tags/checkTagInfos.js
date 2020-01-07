const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = ((req, res, next) => {
  if (req.body.type !== 'music' && req.body.type !== 'sport'
   && req.body.type !== 'hobby' && req.body.type !== 'diet') {
    res.status(400).send('bad tag type');
    debug('bad tag type');
  } else if (req.body.name
    && /^[A-Za-z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]{3,10}$/i.test(req.body.name)) {
    next();
  } else {
    debug(req.body.name.lenght);
    res.status(400).send('bad informations');
    debug('bad tag name');
  }
});
