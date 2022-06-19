import mongoose from 'mongoose'
const infoSchema = new mongoose.Schema({
    name : {type:String, required: true, trim:true},
    bill_no : {type: String, required:true,trim:true},
    price : {type: Number, required:true,trim:true},
    dop : {type:Date, default:Date.now}
})

const InfoModel = mongoose.model('info', infoSchema);

export default InfoModel