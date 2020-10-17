import { randomBytes } from 'crypto';
import express from 'express';
import session from 'express-session';
import { Storage } from '../shared/storage';
import morgan from 'morgan';
import { RSA_NO_PADDING } from 'constants';

const app = express();
const router = express.Router();
const storage = Storage.getInstance();
const cors = require('cors');

const allowedOrgins = process.env.FLIPPER_ALLOWED_ORIGIN?.split(' ') || ['http://localhost:8080', 'https://localhost:8080'] 
console.log(`SET allowedOrigins: ${allowedOrgins.join(', ')}`)

app.use(
  cors({
    // https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
    credentials: true,
    exposedHeaders: ['set-cookie'],
    origin: allowedOrgins
  })
);

app.use(morgan('short'));

app.use(
  session({
    rolling: true,
    secret: randomBytes(265 / 8).toString('hex'), // mix after restart
    name: 'sessionID',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 },
  })
);

function withSession(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session) {
    return next();
  } else {
    return res.status(440).send();
  }
}

// create random mail
router.get('/health', (req, res, next) => {
  res.send('ok');
});

router.post('/mail', withSession, (req, res, next) => {
  let prefix = ''; // not supported by now
  let DOMAIN = process.env.FLIPPER_MAIL_DOMAIN || 'mail.local';

  // create mail
  let id = randomBytes(5).toString('hex');
  let mail = `${prefix}${id}@${DOMAIN}`;

  console.log(`created mail ${mail}`);

  // activate in storage
  storage.set(mail);

  if (req.session!.mails) {
    req.session!.mails.push(mail);
  } else {
    // if session object is existing add to session
    req.session!.mails = [mail];
  }
  console.log(req.sessionID);
  res.send(`${prefix}${id}@${DOMAIN}`);
});

// get all mails for an
router.get('/mail/:mail', withSession, (req, res, next) => {
  if (!req.session!.mails.includes(req.params.mail)) {
    return res.status(403).send('nice try');
  }

  let mail = storage.get(req.params.mail);

  if (!mail) {
    req.session!.mails = req.session!.mails.map(
      (inbox: string) => inbox !== req.params.mail
    );
    return res.status(410).send('mail has expired');
  }

  res.send(mail);
});

// get all mails for socket/interval polling
router.get('/mails', withSession, (req, res, next) => {
  // read session
  res.send(req.session?.mails);
});

// delete mail
router.delete('/mail', withSession, (req, res, next) => {
  res.send('deletion? why? its self destroying dude!');
});

app.use('/api/v1', router);

export function start(port: number) {
  app.listen(port, () => {
    console.log(`🛡\tapi server is running on ${port}`);
  });
}
