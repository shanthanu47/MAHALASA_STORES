import express from 'express';
import { isAuth, login, logout, register, deleteAccount, sendResetOtp, resetPassword, verifyOtp, googleAuth } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)
userRouter.post('/delete-account', authUser, deleteAccount)
userRouter.post('/send-reset-otp', sendResetOtp)
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/google-auth', googleAuth)

export default userRouter