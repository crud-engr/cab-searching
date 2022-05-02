import config from 'config';
import axios from 'axios';

const mailUri: string = config.get('MAIL_URI');
const fromEmail: string = config.get('MAIL_FROM');
const fromName: string = config.get('MAIL_FROM_NAME');
const key: string = config.get('SENDCHAMP_API_KEY');
const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

const sendMail = async (subject: any, to: any, message_body: any) => {
  let data = {
    subject,
    to: {
      email: to.email,
      name: to.name,
    },
    from: {
      email: fromEmail,
      name: fromName,
    },
    message_body: {
      type: 'validation',
      value: message_body,
    },
  };
  try {
    const response = await axios(mailUri, {
      method: 'POST',
      data,
      headers,
    });
    console.log(response);
  } catch (err) {
    console.log(err.message);
  }
};

export default sendMail;
