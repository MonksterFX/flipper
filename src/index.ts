import * as api from './communication/api';
import * as stmp from './communication/smtp';

// start SMTP Server at Port 25
api.start(3000);
stmp.start(25);
