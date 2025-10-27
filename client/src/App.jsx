import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from "react-hot-toast";
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Layout from './Layout';

const App = () => {
    const { isSeller } = useAppContext();

    return (
        <>
            <Toaster />
            <Routes>
                <Route path='/' element={<Layout />}>
                    {/* User Routes */}
                    <Route index element={<Home />} />
                    <Route path='/products' element={<AllProducts />} />
                    <Route path='/products/:category' element={<ProductCategory />} />
                    <Route path='/products/:category/:id' element={<ProductDetails />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/add-address' element={<AddAddress />} />
                    <Route path='/my-orders' element={<MyOrders />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/loader' element={<Loading />} />
                </Route>

                {/* Seller Routes */}
                <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
                    <Route index element={<AddProduct />} />
                    <Route path='product-list' element={<ProductList />} />
                    <Route path='orders' element={<Orders />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
