import UserModel from '../models/User.js'
import ScheduleModel from '../models/Schedule.js'
import DoctorModel from '../models/Doctor.js'
import AppModel from '../models/Appointment.js'
import Mail from '../controllers/traits/mailTrait.js'
import SMS from '../controllers/traits/smsTrait.js'
import Dates from '../controllers/traits/helperTrait.js'
import { response } from 'express'

class AppController {


    static doctors = async(req, res) => {
        // res.render('./apps/doctors',);
        try {
            const result = await DoctorModel.find();
            res.render("./apps/doctors", {
                doctors: result,
                name: req.session.name,
                email: req.session.email,
                id: req.session._id,
                msg: req.flash('msg'),
                errmsg: req.flash('errmsg'),
                url: req.url,
            });
        } catch (error) {
            console.log(error);
        }
    }

    static addDoctor = async(req, res) => {
        try {
            const name = req.body.name
            const spec = req.body.spec
            const degree = req.body.degree
            const fees = req.body.fees
                // const result = DoctorModel.findOne({name:name});
                // if(result == ''){
            const doctor = await new DoctorModel({
                name: name,
                spec: spec,
                degree: degree,
                fees: fees,
                status: true,
                created_by: req.session.name,
            })
            await doctor.save();
            // req.flash('msg', 'Doctor Added Successfully')
            // res.redirect('back');
            res.json(doctor)

        } catch (error) {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log(errors)
            res.json({ err: errors })
        }
    }

    static editDoctor = async(req, res) => {

        try {
            const id = req.params.id
            const doctor = await DoctorModel.findOne({ _id: req.params.id });
            res.json(doctor);
        } catch (error) {
            console.log(error);
        }
    }

    static updateDoctor = async(req, res) => {
        try {
            const id = req.body._id;
            const doctor = await DoctorModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            res.json(doctor);

        } catch (error) {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log(errors)
            res.json({ err: errors })
        }
    }

    static deleteDoctor = async(req, res) => {
        try {
            await DoctorModel.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                    return res.json('deleted');
                } else {
                    console.log('error' + err);
                }
            })


        } catch (error) {

        }
    }



    static schedules = async(req, res) => {
        try {
            const doctors = await DoctorModel.find();
            const schedules = await ScheduleModel.find();
            const inf = DoctorModel.aggregate([{
                    $lookup: {
                        from: "schedules",
                        localField: "_id",
                        foreignField: "doctor_id",
                        as: "schedule_doc",
                    },
                },
                {
                    $unwind: "$schedule_doc",
                },
            ]).exec((err, result) => {
                if (!err) {
                    res.render('./apps/schedules', {
                        schedules: schedules,
                        doctors: doctors,
                        name: req.session.name,
                        email: req.session.email,
                        id: req.session._id,
                        schedule_info: result,
                        url: req.url,
                        msg: req.flash('msg'),
                        errmsg: req.flash('errmsg'),
                    });
                } else {
                    console.log(err);
                }
            });


        } catch (error) {
            console.log(error)
        }
    }

    static addSchedule = async(req, res) => {

        try {
            const doctor_id = req.body.doctor_id;
            const day = req.body.day;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;

            const schedule = new ScheduleModel({
                doctor_id: doctor_id,
                day: day,
                start_time: start_time,
                end_time: end_time,
                created_by: req.session.name,
            });

            await schedule.save();
            res.json(schedule)
                // req.flash('msg', 'Schedule Added Successfully')
                // res.redirect('back');
        } catch (error) {
            let errors = {}
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log(errors)
            res.json({ err: errors })
        }
    }

    static editSchedule = async(req, res) => {
        const doctors = await DoctorModel.find();
        const id = req.params.id;
        const schedule = await ScheduleModel.findOne({ _id: id });
        let singledoc = await DoctorModel.findOne({ _id: schedule.doctor_id })
        res.json({
            schedule_id: schedule._id,
            doctors: doctors,
            doc: schedule.doctor_id,
            doc_name: singledoc.name,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            day: schedule.day,
            name: req.session.name,
            email: req.session.email,
            id: req.session._id,
            url: req.url,
        })
    }

    static updateSchedule = async(req, res) => {
        try {
            const id = req.body._id;
            const schedule = await ScheduleModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            req.flash('msg', 'Schedule Updated Successfully')
            return res.redirect('/schedule/view/');
        } catch (error) {
            console.log(error)
        }

    }

    static deleteSchedule = async(req, res) => {
        try {
            await ScheduleModel.findByIdAndDelete(req.params.id);
            req.flash('msg', 'Schedule Deleted Successfully')
            return res.json('deleted');
        } catch (error) {
            console.log(error)
        }
    }


    static apps = async(req, res) => {
        const doctors = await DoctorModel.find();
        const schedules = await ScheduleModel.find();
        const apps = await AppModel.find();
        const appCount = apps.length;
        const app_no = appCount + 1
            // const inf = await AppModel.aggregate([{
            //         $lookup: {
            //             from: "schedules",
            //             localField: "schedule_id",
            //             foreignField: "_id",
            //             as: "schedule_doc",
            //         },

        //     },
        //     {
        //         $unwind: "$schedule_doc",
        //     },
        // ]).exec()

        const inf2 = await AppModel.aggregate([{
                $lookup: {
                    from: "doctors",
                    localField: "doctor_id",
                    foreignField: "_id",
                    as: "doctor_doc",
                },

            },
            {
                $unwind: "$doctor_doc",
            },
        ]).exec((err, doc) => {
            if (!err) {
                res.render('./apps/apps', {
                    name: req.session.name,
                    app_no: app_no,
                    apps: doc,
                    doctors: doctors,
                    email: req.session.email,
                    id: req.session._id,
                    url: req.url,
                });
            }
        });

    }


    static getSchedule = async(req, res) => {
        const id = req.body.doctor_id;
        const schedules = await ScheduleModel.find({ doctor_id: id });
        const doc = await DoctorModel.find({ doctor_id: id });
        if (schedules) {
            res.json({
                schedules: schedules,
                fees: doc.fees
            })
        } else {
            res.json({ msg: 'Not Found' })
        }
    }


    static getDate = async(req, res) => {
        const id = req.body.schedule_id
        const schedule = await ScheduleModel.findOne({ _id: id });
        let dayvalue = 0
        if (schedule.day == 'Monday') {
            dayvalue = 1
        } else if (schedule.day == 'Tuesday') {
            dayvalue = 2
        } else if (schedule.day == 'Wednesday') {
            dayvalue = 3
        } else if (schedule.day == 'Thursday') {
            dayvalue = 4
        } else if (schedule.day == 'Friday') {
            dayvalue = 5
        } else if (schedule.day == 'Saturday') {
            dayvalue = 6
        } else if (schedule.day == 'Sunday') {
            dayvalue = 7
        }
        let days = Dates.getDates(dayvalue);

        res.json(days)

    }

    static getFees = async(req, res) => {
        try {
            const id = req.body.doctor_id;
            const doctor = await DoctorModel.findOne({ _id: id });
            if (doctor) {
                res.json({ fees: doctor.fees })
            } else {
                res.json("Not Found")
            }
        } catch (error) {
            console.log(error)
        }
    }

    static addApp = async(req, res) => {
        try {
            const app = new AppModel({
                app_no: req.body.app_no,
                app_date: req.body.app_date,
                p_name: req.body.p_name,
                p_email: req.body.p_email,
                p_mobile: req.body.p_mobile,
                p_dob: req.body.p_dob,
                p_gender: req.body.gender,
                co: req.body.co,
                p_address: req.body.p_address,
                schedule_id: req.body.schedule_id,
                doctor_id: req.body.doctor_id,
                payment_mode: req.body.payment_mode,
                booking_mode: req.body.booking_mode,
                payment_status: req.body.payment_status,
                created_by: req.session.name,
            })
            await app.save();
            SMS.sendAppointmentConfirmSMS(req.body.p_mobile, app)
            res.json(app);

        } catch (error) {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log(errors)
            res.json({ err: errors })
        }
    }

    static editApp = async(req, res) => {
        const id = req.params.id;

    }
    static updateApp = async(req, res) => {
        try {
            const id = req.body._id;
            const app = await AppModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            return res.json(app);
        } catch (error) {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log(errors)
            res.json({ err: errors })
        }
    }



    static invoices = async(req, res) => {
        res.render('./invoice/invoices');
    }

    static payments = async(req, res) => {
        res.render('./invoice/payments');
    }




}

export default AppController