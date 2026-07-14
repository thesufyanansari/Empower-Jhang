import express from 'express';
import { sendOtp, verifyOtp, adminLogin, logout, getSession, resendOtp } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { sendOtpSchema, verifyOtpSchema, adminLoginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/send-otp', validateRequest(sendOtpSchema), sendOtp);
router.post('/resend-otp', validateRequest(sendOtpSchema), resendOtp);
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);
router.post('/admin-login', validateRequest(adminLoginSchema), adminLogin);
router.post('/logout', logout);
router.get('/session', getSession);

export default router;
