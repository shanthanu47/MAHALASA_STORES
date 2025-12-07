import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export const useAppContext = () => {
    return useContext(AppContext);
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [address, setAddress] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = useCallback(async () => {
        console.log("Fetching products...");
        try {
            const { data } = await axiosInstance.get('/api/product/all');
            console.log("Response from server:", data);
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log("Error fetching products:", error.message);
        }
    }, []);

    const getAddress = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await axiosInstance.get('/api/address/get');
            if (data.success) {
                setAddress(data.address);
            }
        } catch (error) {
            console.log("Error fetching address:", error.message);
        }
    }, [user]);

    const getCartProducts = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await axiosInstance.get("/api/cart/all");
            if (data.success) {
                setCart(data.cart);
            }
        } catch (error) {
            console.log("Error fetching cart:", error.message);
        }
    }, [user]);


    const addToCart = async (productId) => {
        try {
            const { data } = await axiosInstance.post("/api/cart/add", { product: productId });
            if (data.success) {
                toast.success(data.message);
                // Update cart immediately from response
                if (data.cart) {
                    setCart(data.cart);
                } else {
                    await getCartProducts();
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const { data } = await axiosInstance.post("/api/cart/remove", { product: productId });
            if (data.success) {
                toast.success(data.message);
                // Update cart immediately from response
                if (data.cart) {
                    setCart(data.cart);
                } else {
                    await getCartProducts();
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to remove from cart");
        }
    };

    const clearCart = async () => {
        try {
            const { data } = await axiosInstance.post("/api/cart/clear");
            if (data.success) {
                setCart({});
            }
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cart) {
            if (cart[item] > 0) {
                let itemInfo = products.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.offerPrice * cart[item];
                }
            }
        }
        return totalAmount;
    };
    
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cart) {
            if (cart[item] > 0) {
                totalCount += cart[item];
            }
        }
        return totalCount;
    };

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('api/user/is-auth');
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            setUser(null);
        }
    }, []);

    const fetchSeller = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/api/seller/is-auth');
            setIsSeller(data.success);
        } catch (error) {
            setIsSeller(false);
        }
    }, [user]);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchUser();
        fetchProducts();
        fetchSeller();
    }, []);

    useEffect(() => {
        if (user) {
            getAddress();
            getCartProducts();
        } else {
            setAddress(null);
            setCart({});
        }
    }, [user, getAddress, getCartProducts]);

    const contextValue = {
        axios: axiosInstance,
        user,
        setUser,
        isSeller,
        setIsSeller,
        navigate,
        products,
        fetchProducts,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getCartCount,
        address,
        getAddress,
        showUserLogin,
        setShowUserLogin,
        searchQuery,
        setSearchQuery,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
