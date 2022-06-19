import mongoose from 'mongoose';
const db_url = 'mongodb://localhost:27017/Employee_db';
mongoose.connect(db_url, { useNewUrlParser: true,useUnifiedTopology: true, }, (err) => {
  if (!err) {
    console.log('MongoDB connected successfully');
  } else {
    console.error('ERR_DB_CONNECT : ' + err);
  }
});
export default db_url
