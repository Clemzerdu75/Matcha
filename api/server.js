const debug = require('debug')('app:server');
const env = require('dotenv').config();
const express = require('express');
const fs = require('fs');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const checkToken = require('./config/checkToken');
const checkLoginInfos = require('./controller/loginController');
const createToken = require('./config/create_Token');
const driver = require('./config/database');
const createResetPasswdToken = require('./routes/users/password/createUserPasswdToken');
const sendMail = require('./controller/sendmail');
const putUserPassword = require('./routes/users/password/put_UserPassword');
const newUser = require('../api/routes/users/post_NewUser');
const checkUserInfos = require('../api/routes/users/checkUserInfos');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 8080;
server.listen(port);
const portIo = 8081;
io.listen(portIo, {
  pingTimeout: 10000,
  pingInterval: 5000,
});
const clients = {};


io.on('connect', (socket) => {
  const clientPseudo = socket.handshake.query.pseudo;
  if (!Object.prototype.hasOwnProperty.call(clients, clientPseudo)) {
    clients[clientPseudo] = [];
  }
  clients[clientPseudo].push(socket.id);
  socket.on('disconnect', (reason) => {
    clients[clientPseudo].forEach((element, i) => {
      if (element === socket.id) {
        clients[clientPseudo].splice(i, 1);
        if (!clients[clientPseudo].length) {
          delete clients[clientPseudo];
        }
      }
    });
  });
  socket.on('sendNotif', (values) => {
    if (Object.prototype.hasOwnProperty.call(clients, values.targetPseudo) && values.targetPseudo !== clientPseudo) {
      clients[values.targetPseudo].forEach((socketId) => {
        debug(socketId, values.targetPseudo);
        io.to(socketId).emit('receiveNotif');
      });
    }
  });
  socket.on('sendMessage', (message, receiver, sender) => {
    if (Object.prototype.hasOwnProperty.call(clients, receiver) && receiver !== clientPseudo) {
      clients[receiver].forEach((socketId) => {
        debug(socketId, receiver);
        io.to(socketId).emit('receivemesEvent', message, sender);
        io.emit('messageSent', message, receiver);
      });
    }
  });
  socket.on('isLogged', (targetPseudo) => {
    if (Object.prototype.hasOwnProperty.call(clients, targetPseudo)) {
      io.emit('logged', true);
    } else {
      io.emit('logged', false);
    }
  });
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

app.use(helmet());

app.get('/video', (req, res) => {
  const path = 'public/FIRSTKISS.mp4';
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const { range } = req.headers;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

routes.get('/ValidateAccount/:token/:pseudo', (req, res) => {
  debug(req.params);
  if (!req.params.token || !req.params.pseudo) {
    debug('ok');
    res.status(400).send('Bad link');
  } else {
    const session = driver.session();
    session.run(`MATCH (a:USER {pseudo : {pseudo}, validationToken : {validationToken}, accountStatus : "registered" })
    SET a.accountStatus = "validated", a.validationToken = ""
    RETURN a`, {
      pseudo: req.params.pseudo,
      validationToken: req.params.token,
    })
      .then((result) => {
        if (result.records[0]) {
          res.status(200).send();
        } else {
          res.status(400).send('Invalid Token');
        }
      })
      .catch((e) => debug(e));
  }
});

routes.post('/newUser', checkUserInfos, newUser, (req, res) => {
  res.status(200).send('success');
});

routes.put('/resetPassword', (req, res) => {
  debug(req.body.email);
  createResetPasswdToken(req.body.email)
    .then((token) => {
      sendMail(req.body.email,
        `<p> Hello ! You ask for resetting your password.\nClick <a href="http://localhost:3000/ResetPassword?token=${token}&email=${req.body.email}">here</a> to Activate your account</p>`,
        'Reset Matcha Password');
    })
    .then(() => res.status(200).send())
    .catch((e) => {
      res.status(200).send('bad User');
    });
});

routes.put('/modifyPassword', putUserPassword, (req, res) => {
  res.status(200).send('Password Modified');
});

routes.post('/login', checkLoginInfos, createToken, (req, res) => {
  debug(req.result);
  res.json(req.result);
});

// Définition des CORS
app.use(cors());

// Définition du routeur
app.use('/', routes);
