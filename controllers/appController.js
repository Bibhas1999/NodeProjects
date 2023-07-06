import bcrypt from 'bcrypt'
import { sendMail } from './helpers/Mail.js';
export const HomePage = (req,res) =>{
        res.render("index", {
            title:"Barafwala",
        });
}

export const sendEmailApi = async(req,res) =>{
   try {
    let {name,email,msg} = req.body
    let sentMail = await sendMail(email,name)
    if(sentMail.hasOwnProperty("type") && sentMail.type !="success"){
        let error = {
            name:"MAIL_SENDING_ERROR",
            message:"Mail sending failed"
        }
        throw(new Error(error))
    }else{
        return res.status(201).json({msg:"Mail sent successfully",status:201})
    }
   } catch (error) {
      return res.status(500).json({error:error.name,msg:error.message})
   }
}