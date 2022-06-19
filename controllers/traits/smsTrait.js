import fast2sms from 'fast-two-sms';
const app_key = 'XzQBWPImQXhGQt9qAnJLuzkbnjYcFoj3EvhTnYosQVjV6vBbRcBJw28s9hep'
class SMS {

    static sendForgotPasswordSMS(mobile_no, otp) {
        var options = { authorization: app_key, message: `Dear user,\n Here is your verification code` + " " + `${otp}`, numbers: [mobile_no] }
        fast2sms.sendMessage(options, function(error, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('SMS sent: ' + info.response);
            }
        })
        return mobile_no;
    }

    static sendAppointmentConfirmSMS(mobile_no, data) {
        var message = `Dear user,\n Your appointment has been booked. Find the details below. \n Appointment ID : ${data._id} \n Token No.: ${data.app_no} \n 
                       Appointment Date/Time - ${data.app_date} \n Thank You `;
        var options = {
            authorization: app_key,
            message: message,
            numbers: [mobile_no]
        };
        fast2sms.sendMessage(options, function(error, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('SMS sent: ' + info.response);
            }
        })
    }

}

export default SMS;