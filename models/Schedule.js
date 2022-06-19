import mongoose from 'mongoose'
const scheduleSchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId,ref: 'doctor',required: true },
    day: { type: String, required: true, trim: true },
    start_time: { type: String, required: true, trim: true },
    end_time: { type: String, required: true, trim: true },
    opd_no: { type: String, trim: true },
    status: { type: Boolean, default: true, trim: true },
    created_by: { type: String, trim: true },
    updated_by: { type: String, trim: true },
}, { timestamps: true });


const ScheduleModel = mongoose.model('schedule', scheduleSchema);

export default ScheduleModel
