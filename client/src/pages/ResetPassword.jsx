import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const ResetPassword = () => {
    const { axios, navigate } = useAppContext()
    const location = useLocation()

    const [email, setEmail] = useState(location.state?.email || '')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [step, setStep] = useState(1) // 1: OTP, 2: New Password

    useEffect(() => {
        if (!email) {
            toast.error("Invalid access. Please start the reset process again.")
            navigate('/')
        }
    }, [email, navigate])

    const onVerifyOtp = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios.post('/api/user/verify-otp', { email, otp })

            if (data.success) {
                toast.success(data.message)
                setStep(2)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onResetPassword = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios.post('/api/user/reset-password', {
                email, otp, newPassword
            })

            if (data.success) {
                toast.success(data.message)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-[70vh]'>
            <div className='bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md flex flex-col gap-5'>
                <div className='text-center mb-2'>
                    <h2 className='text-2xl font-semibold text-gray-800 font-serif'>Reset Password</h2>
                    <p className='text-gray-500 text-sm mt-1'>
                        {step === 1
                            ? `Verify the OTP sent to ${email}`
                            : 'Enter your new password below.'
                        }
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={onVerifyOtp} className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-600 font-medium'>Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className='w-full border border-gray-300 rounded-md p-3 outline-primary tracking-[0.5em] text-center font-mono font-bold text-xl'
                                placeholder='000000'
                                maxLength={6}
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            className='bg-primary hover:bg-primary-dull text-white py-2.5 rounded-md transition-all font-medium mt-2 shadow-sm'
                        >
                            Verify OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={onResetPassword} className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-600 font-medium'>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='w-full border border-gray-300 rounded-md p-3 outline-primary'
                                placeholder='Min. 8 characters'
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type='submit'
                            className='bg-primary hover:bg-primary-dull text-white py-2.5 rounded-md transition-all font-medium mt-2 shadow-sm'
                        >
                            Update Password
                        </button>
                    </form>
                )}

                <div className='text-center'>
                    <p className='text-xs text-gray-400'>
                        Didn't receive code? <span className='text-primary cursor-pointer hover:underline'>Resend</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
