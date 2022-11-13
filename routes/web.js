import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js'
import AppController from '../controllers/appController.js'
import Middleware from '../controllers/middleware/middleware.js'

router.get('/', UserController.home);
router.get('/login', UserController.login);

router.get('/forgot/password/view',UserController.viewForgotPassword);
router.post('/forgot/password/',UserController.forgotPassword);
router.get('/reset/password/view/:id',UserController.resetPasswordView);
router.post('/reset/password/',UserController.resetPassword);
router.post('/verify/mail',UserController.verifyEmail);
router.get('/verify/otp/view/:id',UserController.otpVerificationView);
router.post('/verify/otp/',UserController.otpVerification);
router.get('/profile',Middleware.isAuth, UserController.viewProfile);
router.post('/profile/update',Middleware.isAuth, UserController.updateProfile);
router.get('/password/update',Middleware.isAuth, UserController.changePasswordview);
router.post('/password/update',Middleware.isAuth, UserController.changePassword);
router.post('/login', UserController.checkLogin);
router.get('/register', UserController.register);
router.post('/register', UserController.createUser);
router.get('/logout', UserController.logOut);

router.get('/app/view/',Middleware.isAuth, AppController.apps);
router.post('/app/add/',Middleware.isAuth, AppController.addApp);
// router.get('/app/edit/:id',Middleware.isAuth, AppController.editApp);
router.post('/app/update',Middleware.isAuth, AppController.updateApp);
// router.get('/app/delete/;id',Middleware.isAuth, AppController.deleteApp);

router.get('/doctor/view/',Middleware.isAuth, AppController.doctors);
router.post('/doctor/add',Middleware.isAuth, AppController.addDoctor);
router.get('/doctor/edit/:id',Middleware.isAuth, AppController.editDoctor);
router.post('/doctor/update/',Middleware.isAuth, AppController.updateDoctor);
router.get('/doctor/delete/:id',Middleware.isAuth, AppController.deleteDoctor);

router.get('/schedule/view/',Middleware.isAuth, AppController.schedules);
router.post('/schedule/add/',Middleware.isAuth, AppController.addSchedule);
router.get('/schedule/edit/:id',Middleware.isAuth, AppController.editSchedule);
router.post('/schedule/update',Middleware.isAuth, AppController.updateSchedule);
router.get('/schedule/delete/:id',Middleware.isAuth, AppController.deleteSchedule);


router.get('/invoice/view/',Middleware.isAuth, AppController.invoices);
router.get('/payment/view/',Middleware.isAuth, AppController.payments);



router.post('/get/schedule/',Middleware.isAuth, AppController.getSchedule);
router.post('/get/fees/',Middleware.isAuth, AppController.getFees);
router.post('/get/date/',Middleware.isAuth, AppController.getDate);

export default router