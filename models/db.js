import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const db_url = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(db_url, { useNewUrlParser: true,useUnifiedTopology: true, }, (err) => {
  if (!err) {
    console.log('MongoDB connected successfully');
  } else {
    console.error('ERR_DB_CONNECT : ' + err);
  }
});
export default db_url
