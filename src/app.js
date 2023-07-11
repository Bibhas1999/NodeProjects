import express from 'express';
import router from '../routes/route.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import helmet from 'helmet';
dotenv.config()
const app = express();
const port = process.env.APP_PORT
app.set("view-engine","ejs")
app.use(helmet());
app.use(cookieParser())
app.use(express.static("public"));
app.use(express.urlencoded({ extended:true}));
app.use(express.json({extended: false}));
app.use(cors({ origin:"*", credentials:true }))
app.use('/',router);
app.listen(port, () =>{
    console.log(`server is running at port ${port}`);
});





