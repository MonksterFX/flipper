import sanitizeHtml from 'sanitize-html';

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

    // is false
    if(rawMail.html){
      try {
        this.htmlBody = sanitizeHtml(rawMail.html);
      } catch (error) {
        this.htmlBody = rawMail.text;
      }
    }else{
      this.htmlBody = ""
    }

    this.subject = rawMail.subject;
    this.recived = rawMail.date;
  }
}
