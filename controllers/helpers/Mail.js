import nodemailer from 'nodemailer';
import ejs from 'ejs'
import dotenv from 'dotenv'
dotenv.config()
const email = process.env.MAIL_FROM_ADDRESS
const pass = process.env.MAIL_PASSWORD
const service = process.env.MAIL_SERVICE
const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: email,
        pass: pass,
    }
});

export const sendMail = async(useremail,username) => {
    let returnObj = {
        type:"",
        data:""
    }
    try {
        const view = "./views/mails/verification-email.ejs";
        const data = {email:useremail,name:username};
        const html = await ejs.renderFile(view, data, {async: true});
        const mainOptions = {
                        from: `"Bibhas" ${email}`,
                        to: useremail,
                        subject: 'Greeting Mail',
                        html: html
                    };  
        try {
            let mailSent = await transporter.sendMail(mainOptions) 
            console.log(mailSent)
            if(mailSent){
                returnObj.type="success",
                returnObj.data=mailSent
            }

        } catch (error) {
            console.log("error in mail",error)
            returnObj.type="error",
            returnObj.data=null
        }
    } catch (error) {
        console.log("error in mail",error)
        returnObj.type="error",
        returnObj.data=null
    }

    return returnObj
   
}
