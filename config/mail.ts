import nodemailer from 'nodemailer';
import config from 'config';

const mail_from: string = config.get('MAIL_FROM');
const mail_host: string = config.get('MAIL_HOST');
const mail_port: number = parseInt(config.get('MAIL_PORT'));
const mail_username: string = config.get('MAIL_USERNAME');
const mail_password: string = config.get('MAIL_PASSWORD');

export const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: mail_host,
    port: mail_port,
    secure: false,
    auth: {
      user: mail_username,
      pass: mail_password,
    },
  });

  const mailOptions = {
    from: `Chekkit <${mail_from}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
