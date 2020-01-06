const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = (notification) => new Promise((resolve, reject) => {
  const notifications = notification.split('//+');
  const parsedNotif = [];
  let modified = false;
  let i = 0;
  notifications.reverse();
  notifications.forEach((message) => {
    const tab = message.split(';');
    const date = new Date(tab[3] * 1);
    parsedNotif.forEach((current) => {
      if (tab[0] === current.title && tab[1] === current.sender) {
        if (parseInt(tab[3], 10) > current.time) {
          current.time = parseInt(tab[3], 10);
          modified = true;
        }
      }
    });
    //debug(typeof tab[3]);
    if (modified === false) {
      const stringDate = (Date.now() - tab[3]) / 86400000 > 86400000
        ? `${Math.floor((Date.now() - tab[3]) / 86400000)}Days ago`
        : `Today at ${date.getHours()}h${date.getMinutes()}`;
      parsedNotif[i] = {
        title: tab[0],
        sender: tab[1],
        message: tab[2],
        time: new Date(tab[3] * 1).toUTCString(),
        timeString: stringDate,
        photo: tab[4],
      };
      i += 1;
    } else {
      modified = false;
    }
  });
  parsedNotif.shift();
  //debug(parsedNotif);
  resolve(parsedNotif);
});
