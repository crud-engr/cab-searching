import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import config from 'config';

const mail_from:string = config.get('MAIL_FROM');
const mail_host:string = config.get('MAIL_HOST');
const mail_port: number = parseInt(config.get('MAIL_PORT'));
const mail_username: string = config.get('MAIL_USERNAME');
const mail_password: string = config.get('MAIL_PASSWORD');

export default class Email {
  public user: string;
  public token: any;
  public to: string;
  public from: string;
  public firstName: string;

  constructor(user: any, token: any) {
    this.to = user.email;
    this.from = `Chekkit <${mail_from}>`;
    this.token = token;
    this.firstName = user.name.split(' ')[0];
  }

  transport() {
    return nodemailer.createTransport({
      host: mail_host,
      port: mail_port,
      secure: false,
      auth: {
        user: mail_username,
        pass: mail_password,
      },
    });
  }

  async send(template:any, subject:string) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      token: this.token,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.transport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome To Chekkit');
  }

  async sendActivationMail() {
    await this.send('activation', 'Account Successfully Activated');
  }
}