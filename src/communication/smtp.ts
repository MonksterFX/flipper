import { Stream } from 'stream';
import { Mail } from '../shared/mail';
import { Storage } from '../shared/storage';

const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;

const storage = Storage.getInstance();

// https://stackoverflow.com/q/35567301/10101463
const server = new SMTPServer({
  secure: false,
  authOptional: true,
  onData: (stream: Stream, session: any, callback: any) => {
    simpleParser(stream).then((parsed: any) => {
      let mail = new Mail(parsed);
      storage.store(mail);
    });
    stream.on('end', callback);
    // stream.pipe(parser); // Print the message to stdout
    // stream.on('end', callback); // Must run the callback once done
  },
});

export function start(port: number) {
  server.listen(port, () => {
    console.log(`📬\tsmtp server is running on ${port}`);
  });
}
