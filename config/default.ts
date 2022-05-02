require('dotenv').config();

export default {
  DB_CONN: process.env.DB_CONN,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  MAIL_URI: process.env.MAIL_URI,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
  SENDCHAMP_API_KEY: process.env.SENDCHAMP_API_KEY,
};
