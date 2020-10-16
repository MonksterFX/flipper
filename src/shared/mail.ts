export interface IMail {
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody: string;
  recived: Date;
}

export class Mail implements IMail {
  from: string;
  to: string;
  subject!: string;
  body!: string;
  htmlBody!: string;
  recived!: Date;

  constructor(rawMail: any) {
    this.to = rawMail.to.text;
    this.from = rawMail.from.text;
    this.body = rawMail.text;
    this.htmlBody = rawMail.html;
    this.subject = rawMail.subject;
    this.recived = rawMail.date;
  }
}
