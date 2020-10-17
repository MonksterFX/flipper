# flipper (alpha)

Creating temporary email inboxes with api.

## send testmails

You can use `scripts/sendmail.js` to send testmails in an defined interval to the smtp server on localhost. Be aware that you have to add a virtual host to your hosts file.

To add a virtual host on OSX add a line in your `/privat/etc/hosts` with **mail.local** directing to **127.0.0.1**.

## flipper-ui

A prototyp UI concept for flipper can be found here: [flipper-ui](https://github.com/MonksterFX/flipper-ui)

## docker

Build it with

```
docker build --pull --rm -t flipper:latest .
```

Run it with

```
docker run -p 25:25 -p 3000:3000 flipper
```
