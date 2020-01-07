const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = (conversation) => new Promise((resolve, reject) => {
  const messages = conversation.split('/&^');
  const parsedMessages = [];
  messages.forEach((message, i) => {
    const tab = message.split(';\\%$');
    parsedMessages[i] = {
      message: tab[0], sender: tab[1], time: new Date(tab[2] * 1).toUTCString(),
    };
  });
  parsedMessages.reverse().shift();
  resolve(parsedMessages);
});
