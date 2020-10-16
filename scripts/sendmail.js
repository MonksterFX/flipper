const meow = require('meow');
const cli = meow(
  `
    Usage
      $ foo
 
    Options
      --rainbow, -r  Include a rainbow
      --unicorn, -u  Include a unicorn
      --no-sparkles  Exclude sparkles
 
    Examples
      $ foo
      🌈 unicorns✨🌈
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

console.log(
  cli.input[0],
  cli.flags.list.split(',').map((v) => v.trim())
);

// dns lookup
// faking domain in /privat/etc/hosts
const dns = require('dns');

dns.lookup('mail.local', 4, (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});

//https://nodejs.org/api/dns.html#dns_dnspromises_resolvemx_hostname
// overide dns.resolveMX to fake mx lookup
dns.resolveMx = (domain, call) => {
  call(null, [{ exchange: 'mail.local', priority: 10 }]);
};

var sendmail = require('sendmail')({ silent: true });
var count = 0;

const testmail = () => {
  var mails = cli.flags.list.split(',').map((v) => v.trim());
  mails.forEach((mail) => {
    sendmail(
      {
        from: 'test@example.test',
        to: mail,
        subject: 'MailComposer sendmail',
        html: `Mail of test ${count}`,
      },
      function (err, reply) {
        console.log(`send mail to ${mail}`);
        console.log(err && err.stack);
        console.dir(reply);
      }
    );
  });
};

testmail();
setInterval(() => {
  count++;
  testmail();
}, 2000);
