import mongoose from 'mongoose'
const doctorSchema = new mongoose.Schema({
    name : {type:String, required: true, trim:true},
    spec : {type: String, required:true,trim:true},
    degree : {type: String,required: true,trim:true},
    fees: {type: Number,required:true,trim:true},
    status:{type: Boolean,required: true,trim:true},
    created_by : {type:String,required: true, trim:true},
    updated_by : {type:String, trim:true},
},{ timestamps: true });


const DoctorModel = mongoose.model('doctor', doctorSchema);

export default DoctorModel
