import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

    const { setShowUserLogin, setUser, axios, navigate } = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onGoogleSuccess = async (response) => {
        try {
            const { data } = await axios.post('/api/user/google-auth', {
                token: response.credential
            });
            if (data.success) {
                toast.success("Logged in with Google")
                setUser(data.user)
                setShowUserLogin(false)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onGoogleError = () => {
        toast.error("Google Login failed")
    }

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const url = state === "forgot-password" ? "/api/user/send-reset-otp" : `/api/user/${state}`;
            const { data } = await axios.post(url, {
                name, email, password
            });
            if (data.success) {
                if (state === "forgot-password") {
                    toast.success(data.message)
                    navigate('/reset-password', { state: { email } })
                    setShowUserLogin(false)
                } else {
                    navigate('/')
                    setUser(data.user)
                    setShowUserLogin(false)
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : "Reset Password"}
                </p>

                <div className='m-auto py-2'>
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={onGoogleError}
                        theme="filled_blue"
                        shape="pill"
                    />
                </div>

                <div className='flex items-center gap-2 w-full text-gray-400 py-2'>
                    <hr className='flex-1 border-gray-200' />
                    <span>OR</span>
                    <hr className='flex-1 border-gray-200' />
                </div>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                {state !== "forgot-password" && (
                    <div className="w-full ">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                    </div>
                )}
                {state === "login" && (
                    <p onClick={() => setState("forgot-password")} className="text-primary cursor-pointer -mt-2">
                        Forgot password?
                    </p>
                )}
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : state === "login" ? (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p>
                            Back to <span onClick={() => setState("login")} className="text-primary cursor-pointer">Login</span>
                        </p>
                        <p>
                            Don't have an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">Sign up</span>
                        </p>
                    </div>
                )}
                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : state === "login" ? "Login" : "Send Reset OTP"}
                </button>
            </form>
        </div>
    )
}

export default Login
