
import React from 'react'
import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Login from './components/Login'
import { useAppContext } from './context/AppContext'

const Layout = () => {

    const isSellerPath = useLocation().pathname.includes("seller");
    const { showUserLogin } = useAppContext();

    return (
        <div className='text-default min-h-screen text-gray-700 bg-white'>

            {
                !isSellerPath && <Navbar />
            }

            {
                showUserLogin && <Login />
            }

            <main className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
                <Outlet />
            </main>

            {
                !isSellerPath && <Footer />
            }

        </div>
    )
}

export default Layout
