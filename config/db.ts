import mongoose from 'mongoose';
require('dotenv').config();
import config from 'config';

export default function connectDB() {
  const db: string = config.get('DB_CONN');
  mongoose
    .connect(db)
    .then((conn) =>
      console.log(`mongodb connected successfully:${conn.connection.host}`)
    )
    .catch((err) => console.log(`Server connection error: ${err.message}`));
}
