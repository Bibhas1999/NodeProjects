import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: Number, trim: true },
    dob: { type: Date },
    usertype: { type: String, trim: true },
    gender: { type: String, trim: true },
    address: { type: String, trim: true },
    profile_img: { type: String, trim: true },
    adhaar_no: { type: String, trim: true },
    pan_no: { type: String, trim: true },
    voter_no: { type: String, trim: true },
    div_no: { type: String, trim: true },
    password: { type: String, required: true, trim: true },
    is_verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    login_attempt: { type: Number, default: 6 },
    otp: { String },
    join: { type: Date, default: Date.now }

});


const UserModel = mongoose.model('user', userSchema);

export default UserModel