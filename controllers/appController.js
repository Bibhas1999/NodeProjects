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
        throw("Mail sending failed")
    }else{
        return res.status(201).json({msg:"Mail sent successfully",status:201})
    }
   } catch (error) {
      console.log(error)
      return res.status(500).json({error:error,msg:error})
   }
}