import express from 'express';
import web from './routes/web.js';
import db from './models/db.js';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import flash from 'connect-flash';
import dotenv from 'dotenv'
dotenv.config()
//For session storing
// const MongoDBStore = connectMongoDBSession(session);
// var store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/Employee_db',
//   collection: 'sessions'
  
// });

var app = express();
app.listen(4000, () =>{
    console.log('server is running at port 4000');
});

app.set('view engine','ejs');
app.use(express.static( "public" ) );
app.use(flash());
app.use(express.urlencoded({ extended:true}));
app.use(session({
    secret: 'a09xKwgqjpLqwqnfnvkfks09',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 86400 * 1000))
  })) 
app.use('/',web);


