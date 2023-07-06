import express from 'express';
import { HomePage,sendEmailApi } from '../controllers/appController.js';

const router = express.Router();
router.get('/', HomePage);
router.post('/send-mail/:key', sendEmailApi);

export default router