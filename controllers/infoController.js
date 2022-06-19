import InfoModel from '../models/Info.js'

class InfoController {



    static viewaddMemo = async (req, res) => {


        res.render('users/addOrEdit', {
            viewTitle: 'Add Memo',
            name: req.session.name,
            email: req.session.email,
            id: req.session._id,
        });
    }

    static vieweditMemo = async (req, res) => {
        InfoModel.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render('users/addOrEdit', {
                    viewTitle: 'Edit Memo',
                    memo: doc,
                    name: req.session.name,
                    email: req.session.email,
                    id: req.session._id,
                })
            } else {
                console.log('error' + err);
            }
        })
    }

    static addMemo = async (req, res) => {

        try {
            const doc = new InfoModel({
                name: req.body.name,
                bill_no: req.body.bill_no,
                price: req.body.price,

            })
            await doc.save()
            res.render('users/addOrEdit', {
                viewTitle: 'Add Memo',
                memo: req.body,
                name: req.session.name,
                email: req.session.email,
                id: req.session._id,
            });
        } catch (error) {
            console.log(error);
        }
    }

    static showMemos = async (req, res) => {

        try {
           await InfoModel.find((err, docs) => {
                if (!err) {
                    res.render("users/list", {
                        list: docs,
                        name: req.session.name,
                        email: req.session.email,
                        id: req.session._id,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    static deleteMemo = (req, res) => {
        try {
            InfoModel.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                    res.redirect('/list');
                } else {
                    console.log('error' + err);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static updateMemo = async (req, res) => {

        try {
            await InfoModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
                return res.redirect('/list');
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default InfoController