// --------------------- cli ---------------------

const meow = require('meow');
const cli = meow(
  `
    Usage
      $ sendmail
 
    Options
      --list, -l 'mail1, mail2, mail3...' send to a list of mail adresses
      --interval, -i  Send interval in ms
 
    Examples
      $ node sendmailer -l 'mail@example.org, mail@example.org'
`,
  {
    booleanDefault: undefined,
    flags: {
      list: {
        type: 'string',
        default: '',
        alias: '-l',
      },
      interval: {
        type: 'number',
        default: 10000,
        alias: '-i',
      },
    },
  }
);

// debug print()
console.log(
  cli.input[0],
  cli.flags.list.split(',').map((v) => v.trim())
);

// --------------------- local test enviroment ---------------------

const dns = require('dns');

// dns lookup
// faking domain in /privat/etc/hosts
dns.lookup('mail.local', 4, (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});

//https://nodejs.org/api/dns.html#dns_dnspromises_resolvemx_hostname
// overide dns.resolveMX to fake mx lookup
dns.resolveMx = (domain, call) => {
  call(null, [{ exchange: 'mail.local', priority: 10 }]);
};

// --------------------- script ---------------------

var sendmail = require('sendmail')({ silent: true });
var count = 0;

const testmail = () => {
  var mails = cli.flags.list.split(',').map((v) => v.trim());
  mails.forEach((mail) => {
    count++;
    sendmail(
      {
        from: 'test@example.test',
        to: mail,
        subject: `MailComposer sendmail #${count}`,
        text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam 
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est 
          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed 
          diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
          voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd 
          gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
        html: `<h1>Lorem ipsum dolor sit amet, consetetur sadipscing elitr<h1> 
        <p>sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
        voluptua. At vero eos et accusam</p>
        <p>et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est 
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed 
        diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd 
        gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>`,
      },
      function (err, reply) {
        console.log(`send mail to ${mail}`);
        console.log(err && err.stack);
        console.dir(reply);
      }
    );
  });
};

setInterval(() => {
  testmail();
}, 2000);
