import mongoose from 'mongoose'
const appSchema = new mongoose.Schema({
    app_no: { type: Number, required: "Appointment No. is required", trim: true },
    app_date: { type: Date, required: "Please provide appointment date", trim: true },
    p_name: { type: String, required: "Please provide patient name", trim: true },
    p_dob: { type: Date, required: "Please provide patient date of birth", trim: true },
    p_gender: { type: String, required: "Please select a gender", trim: true },
    p_mobile: { type: Number, required: "Please provide a mobile no.", trim: true },
    p_email: { type: String, trim: true },
    p_address: { type: String, required: "Please provide address", trim: true },
    co: { type: String, required: "Guardian name is required", trim: true },
    schedule_id: { type: mongoose.Schema.Types.ObjectId,ref: 'schedule',required: "Please select a schedule" },
    doctor_id: { type: mongoose.Schema.Types.ObjectId,ref: 'doctor',required: "Please select a doctor"  },
    status: { type: Boolean, trim: true, required: "This field is required", default: false },
    payment_mode: { type: String, trim: true, required: "This field is required"},
    payment_status: { type: String, trim: true, required: "This field is required"},
    booking_mode: { type: String, trim: true, required: "This field is required"},
    created_by: { type: String, trim: true, required: "This field is required", },
    updated_by: { type: String, trim: true },
}, { timestamps: true });


const AppModel = mongoose.model('appointment', appSchema);

export default AppModel
