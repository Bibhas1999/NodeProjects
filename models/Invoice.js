import mongoose from 'mongoose'
const invoiceSchema = new mongoose.Schema({
    app_id: { type: String, required: true, trim: true },
    status: { type: Boolean, trim: true, required: true, default: false },
    payment: { type: Boolean, trim: true, required: true, default:false },
    created_by: { type: String, trim: true, required: true, },
    updated_by: { type: String, trim: true },
}, { timestamps: true });


const InvoiceModel = mongoose.model('invoice', invoiceSchema);

export default InvoiceModel
