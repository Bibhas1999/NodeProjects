
import nodemailer from 'nodemailer';
import ejs from 'ejs'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bibhasash@gmail.com',
        pass: 'fejcfekmtmupvmcw',
    }
});
class Mail {


    static async sendVerificationMail(useremail) {

        ejs.renderFile("./views/mails/verification-email.ejs", { email: useremail }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: '"Bibhas" bibhasash@gmail.com',
                    to: useremail,
                    subject: 'Verify Your Email',
                    html: data
                };

                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }

        });

        return useremail;
    }

    static async sendResetPasswordMail(useremail,otp) {

        ejs.renderFile("./views/mails/reset-password-email.ejs", 
        { email: useremail,
          otp:otp,
         }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: '"Bibhas" bibhasash@gmail.com',
                    to: useremail,
                    subject: 'Reset Password',
                    html: data
                };

                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }

        });

        return useremail;
    }
}

export default Mail;