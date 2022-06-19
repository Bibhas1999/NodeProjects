import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import Mail from '../controllers/traits/mailTrait.js'
import SMS from '../controllers/traits/smsTrait.js'
// import ejs from 'ejs'
class UserController {
    //method for home page
    static home = (req, res) => {
        if (req.session.email) {
            res.render("index", {
                name: req.session.name,
                email: req.session.email,
                id: req.session._id,
                url: req.url,
            });
        } else {
            req.flash('msg', 'Please login to access')
            res.redirect("/login");
        }

    }

    //method for register page
    static register = (req, res) => {
            if (!req.session.email) {
                return res.render('register', { msg: req.flash('msg') });
            } else {
                return res.redirect("/");
            }
        }
        // method for creating users
    static createUser = async(req, res) => {
            try {
                const { email, password } = req.body;
                const result = await UserModel.findOne({ email: email });
                if (result) {
                    req.flash('msg', 'Email already registered')
                    return res.redirect('/register');
                } else {
                    const hash = bcrypt.hashSync(req.body.password, 10);
                    const doc = new UserModel({
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        password: hash,
                    })
                    if (req.body.cpassword == req.body.password) {
                        await doc.save();
                        Mail.sendVerificationMail(req.body.email);
                        req.flash('msg', 'Registered successfully')
                        res.redirect('back');
                    } else {
                        req.flash('msg', 'Password Mismatched')
                        res.redirect('/register');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        //method for login page
    static login = (req, res) => {
        if (!req.session.email) {
            return res.render('login', {
                msg: req.flash('msg'),
                attempt: req.flash('attempt'),
            });
        } else {
            return res.redirect("/");
        }
    }


    //method for checking login
    static checkLogin = async(req, res) => {
        try {
            const { email, password } = req.body;
            const result = await UserModel.findOne({ email: email });
            if (typeof email == undefined) {
                req.flash('msg', "Email and Password field cannot be empty.")
                return res.redirect('/login');
            }
            if (!result) {
                req.flash('msg', "User with this email doesn't exist.")
                return res.redirect('/login');
            }
            const IsMatch = await bcrypt.compare(password, result.password)
            if (!IsMatch) {
                var loginAttempt = result.login_attempt;
                if (loginAttempt > 0) {
                    loginAttempt -= 1;
                    const update_attempt = await UserModel.updateOne({ login_attempt: loginAttempt });
                    req.flash('msg', 'Invalid Password.Please try again!');
                    req.flash('attempt', "Attemp left" + "-" + " " + `${loginAttempt}`);
                    console.log(req.socket.remoteAddress);
                    return res.redirect('/login');
                } else {
                    const update_activation = await UserModel.updateOne({ active: false });
                    req.flash('msg', 'You exceeded number of attempts.Contact administrator for activation!');
                    return res.redirect('/login');
                }

            } else {
                if (result.active == true && result.is_verified == true) {
                    var sess = req.session
                    sess.name = result.name
                    sess.email = result.email
                    return res.redirect('/');
                } else {
                    req.flash('msg', 'Your account has been either deactivated or is not verified.Contact administrator for activation!');
                    return res.redirect('/login');
                }
            }
        } catch (error) {
            console.log(error);
        }

    }

    static verifyEmail = async(req, res) => {
        try {
            const email = req.body.email;
            let verified = true;
            console.log(email);
            const result = await UserModel.findOne({ email: email });
            result.is_verified = true;
            console.log(result.is_verified)
            if (result) {
                const verification = await UserModel.updateOne({ email: email }, { $set: { is_verified: true } });
                req.flash('msg', 'Your email is verified successfully');
                return res.redirect('/login');
            } else {
                console.log('Something went wrong!')
                req.flash('msg', 'Something went wrong during ');
                return res.redirect('/login');
            }
        } catch (error) {
            console.log(error)
        }
    }


    static viewForgotPassword = async(req, res) => {
        return res.render('forgot-password', {
            errmsg: req.flash('errmsg'),
            msg: req.flash('msg'),
        })
    }

    static forgotPassword = async(req, res) => {
        try {
            const email = req.body.email;
            const mobile = req.body.mobile;
            var otp = Math.floor(100000 + Math.random() * 900000)
            await UserModel.updateOne({ otp: otp });
            if (email) {
                const result1 = await UserModel.findOne({ email: email });
                if (result1) {
                    Mail.sendResetPasswordMail(result1.email, otp);
                    req.flash('msg', 'An email has been sent to ' + `${result1.email}`);
                    return res.redirect('/verify/otp/view/' + `${result1._id}`);
                } else {
                    console.log('Something went wrong!')
                    req.flash('errmsg', "No user has been found associated with this email");
                    return res.redirect('back');
                }
            } else if (mobile) {
                const result2 = await UserModel.findOne({ mobile: mobile });
                if (result2) {

                    SMS.sendForgotPasswordSMS(mobile, otp)
                    req.flash('msg', 'An sms has been sent to ' + `${result2.mobile}`);
                    return res.redirect('/verify/otp/view/' + `${result2._id}`);
                } else {
                    console.log('Something went wrong!')
                    req.flash('errmsg', "No user has been found associated with this email");
                    return res.redirect('back');
                }
            } else {
                console.log('Something went wrong!')
                req.flash('errmsg', "Error : Email or Mobile No. is required");
                return res.redirect('back');
            }

        } catch (error) {
            console.log(error);
        }
    }

    static otpVerificationView = async(req, res) => {
        const id = req.params._id;
        const result = await UserModel.findOne({ _id: req.params.id });
        return res.render('verification-code', {
            id: req.params.id,
            email: result.email,
            msg: req.flash('msg'),
        });
    }

    static otpVerification = async(req, res) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            const result = await UserModel.findOne({ email: email });
            //    console.log(typeof otp)
            if (result.otp == otp) {
                await UserModel.updateOne({ email: email }, { $set: { otp: null } });
                return res.redirect('/reset/password/view/' + `${result._id}`);

            } else {
                req.flash('msg', 'Invalid OTP.Please try again')
                return res.redirect('back');
            }
        } catch (error) {
            console.log(error);
        }

    }


    static resetPasswordView = async(req, res) => {
        return res.render('reset-password', { id: req.params.id })
    }

    static resetPassword = async(req, res) => {

        try {

            const id = req.body.id;
            const result = await UserModel.findOne({ _id: id });
            if (result) {
                if (req.body.new_password != req.body.c_new_password) {
                    req.flash('msg', "Password doesn't match")
                    return res.redirect('back');
                }
                const hashedpassword = bcrypt.hashSync(req.body.new_password, 10);
                const updatePassword = await UserModel.updateOne({ password: hashedpassword });
                req.flash('msg', "Password Updated Successfully")
                return res.redirect('/login');
            }


        } catch (error) {
            console.log(error)
        }

    }

    static logOut = (req, res) => {

        try {
            if (req.session) {
                req.session.destroy();
                return res.redirect('/login');
            }
        } catch (error) {
            console.log(error)
        }
    }

    static viewProfile = async(req, res) => {
        try {
            var email = req.session.email;
            const result = await UserModel.findOne({ email: email });
            res.render('users/profile', {
                name: result.name,
                email: result.email,
                id: result._id,
                mobile: result.mobile,
                dob: result.dob,
                gender: result.gender,
                address: result.address,
                adhaar_no: result.adhaar_no,
                pan_no: result.pan_no,
                voter_no: result.voter_no,
                usertype: result.usertype,
            })

        } catch (error) {
            console.log(error)
        }
    }

    static updateProfile = async(req, res) => {

        try {
            const email = req.session.email;
            const data = await UserModel.findOneAndUpdate({ email: req.session.email }, req.body, { new: true });
            if (data) {
                return res.redirect('back');
            }

        } catch (error) {
            console.log(error)
        }

    }

    static changePasswordview = (req, res) => {

        return res.render('users/change_pass.ejs', {
            email: req.session.email,
            name: req.session.name,
            msg: req.flash('errmsg')
        });
    }

    static changePassword = async(req, res) => {
        const email = req.session.email;
        const result = await UserModel.findOne({ email: email });
        const IsMatch = bcrypt.compareSync(req.body.current_password, result.password)
        const IsMatchSame = bcrypt.compareSync(req.body.new_password, result.password)
        if (!IsMatch) {
            req.flash('errmsg', 'Current Password is incorrect')
            return res.redirect('back');
        }

        if (IsMatchSame) {
            req.flash('errmsg', 'New Password shouldn not be same as current password');
            return res.redirect('back');
        }

        if (req.body.new_password != req.body.c_new_password) {
            req.flash('errmsg', "Password doesn't match")
            return res.redirect('back');
        }
        const hashedpassword = bcrypt.hashSync(req.body.new_password, 10);
        const updatePassword = await UserModel.updateOne({ password: hashedpassword });
        req.flash('errmsg', "Password Updated Successfully")
        return res.redirect('back');
    }




}

export default UserController