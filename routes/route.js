import express from 'express';
import { HomePage,sendEmailApi } from '../controllers/appController.js';

const router = express.Router();
router.get('/', HomePage);
router.post('/api/send-mail/:key', sendEmailApi);

export default router