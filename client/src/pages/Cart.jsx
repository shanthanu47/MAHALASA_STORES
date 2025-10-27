import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../utils/invoicePDF";

const Cart = () => {
    const {
        products,
        cart,
        removeFromCart,
        getTotalCartAmount,
        user,
        navigate,
        axios,
        address, // Changed from addresses
        getAddress, // Changed from getAddresses
    } = useAppContext();

    const [deliveryCost, setDeliveryCost] = useState(0);

    useEffect(() => {
        if (user) {
            getAddress();
        }
    }, [user, getAddress]);

    // Calculate delivery cost when address changes
    useEffect(() => {
        const calculateDeliveryCost = async () => {
            if (address && address.zipcode) {
                // Ensure zipcode is a 6-digit number
                const pincode = String(address.zipcode).padStart(6, '0');
                if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
                    setDeliveryCost(100); // Default cost for invalid pincode
                    toast.error("Invalid pincode format.");
                    return;
                }

                try {
                    const { data } = await axios.get(`/api/pincode/delivery-cost/${pincode}`);
                    if (data.success) {
                        setDeliveryCost(data.data.deliveryCost);
                        if (data.data.isDefault) {
                            toast.error('Delivery not available for this pincode');
                        }
                    } else {
                        setDeliveryCost(100); // Default cost
                        toast.error(data.message || 'Delivery not available for this pincode');
                    }
                } catch (error) {
                    setDeliveryCost(100); // Default cost on error
                    console.log('Delivery cost calculation failed:', error.response?.data?.message);
                    toast.error('Could not calculate delivery cost.');
                }
            } else {
                setDeliveryCost(0);
            }
        };

        calculateDeliveryCost();
    }, [address, axios]);

    const placeOrder = async () => {
        if (!address) {
            return toast.error("Please add or select an address");
        }

        const orderItems = Object.keys(cart).map((key) => ({
            product: key,
            quantity: cart[key],
        }));

        try {
            // Online payment flow
            const { data: orderData } = await axios.post(
                "/api/order/create-razorpay-order",
                {
                    items: orderItems,
                    address: address._id,
                }
            );

            if (orderData.success) {
                if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
                    toast.error("Razorpay configuration error. Please contact support.");
                    return;
                }
                
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Mahalasa Stores",
                    description: "Test Transaction",
                    order_id: orderData.order.id,
                    handler: async (response) => {
                        try {
                            const { data } = await axios.post(
                                "/api/order/online",
                                {
                                    userId: user._id,
                                    items: orderItems,
                                    address: address._id,
                                    paymentDetails: {
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_signature: response.razorpay_signature,
                                    },
                                }
                            );

                            if (data.success) {
                                toast.success(data.message);
                                
                                // Generate and download invoice PDF
                                try {
                                    // Debug logging
                                    console.log("Order data for PDF:", {
                                        orderId: data.orderId,
                                        orderItems,
                                        products: products.length,
                                        user,
                                        address
                                    });

                                    // Prepare order data for PDF
                                    const orderForPDF = {
                                        _id: data.orderId || orderData.order.id,
                                        date: new Date(),
                                        items: orderItems.map(item => {
                                            const product = products.find(p => p._id === item.product);
                                            return {
                                                name: product?.name || 'Unknown Product',
                                                quantity: item.quantity,
                                                price: product?.offerPrice || product?.price || 0
                                            };
                                        }),
                                        amount: orderData.order.amount / 100, // Convert from paise to rupees
                                        deliveryFee: deliveryCost,
                                        address: address
                                    };
                                    
                                    console.log("Prepared order for PDF:", orderForPDF);
                                    
                                    const fileName = generateInvoicePDF(
                                        orderForPDF,
                                        user,
                                        response.razorpay_payment_id
                                    );
                                    
                                    toast.success(`Invoice downloaded: ${fileName}`);
                                } catch (pdfError) {
                                    console.error("PDF generation error:", pdfError);
                                    console.error("PDF error stack:", pdfError.stack);
                                    toast.error("Invoice could not be generated, but order was successful");
                                }
                                
                                navigate("/my-orders");
                            } else {
                                toast.error(data.message);
                            }
                        } catch (error) {
                            toast.error(error.message);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
                
                try {
                    if (!window.Razorpay) {
                        toast.error("Razorpay library not loaded. Please refresh the page.");
                        return;
                    }
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } catch (razorpayError) {
                    console.error('Razorpay initialization error:', razorpayError);
                    toast.error("Payment gateway initialization failed. Please try again.");
                }
            } else {
                toast.error(orderData.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row mt-16">
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm text-primary">
                        {Object.keys(cart).length} Items
                    </span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {products.map((product) => {
                    if (cart[product._id] > 0) {
                        return (
                            <div
                                key={product._id}
                                className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
                            >
                                <div className="flex items-center md:gap-6 gap-3">
                                    <div
                                        onClick={() => {
                                            navigate(
                                                `/products/${product.category.toLowerCase()}/${
                                                    product._id
                                                }`
                                            );
                                            scrollTo(0, 0);
                                        }}
                                        className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                                    >
                                        <img
                                            className="max-w-full h-full object-cover"
                                            src={product.image[0]}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div>
                                        <p className="hidden md:block font-semibold">
                                            {product.name}
                                        </p>
                                        <div className="font-normal text-gray-500/70">
                                            <p>
                                                Weight: <span>{product.weight || "N/A"}</span>
                                            </p>
                                            <div className="flex items-center">
                                                <p>Qty:</p>
                                                <p className="font-semibold">{cart[product._id]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center">
                                    Rs.{product.offerPrice * cart[product._id]}
                                </p>
                                <button
                                    onClick={() => removeFromCart(product._id)}
                                    className="cursor-pointer mx-auto"
                                >
                                    <img
                                        src={assets.remove_icon}
                                        alt="remove"
                                        className="inline-block w-6 h-6"
                                    />
                                </button>
                            </div>
                        );
                    }
                })}

                <button
                    onClick={() => {
                        navigate("/products");
                        scrollTo(0, 0);
                    }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                >
                    <img
                        className="group-hover:-translate-x-1 transition"
                        src={assets.arrow_right_icon_colored}
                        alt="arrow"
                    />
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {address
                                ? `${address.street}, ${address.city}, ${address.state}, ${address.country}`
                                : "No address found"}
                        </p>
                        <button
                            onClick={() => navigate("/add-address")}
                            className="text-primary hover:underline cursor-pointer"
                        >
                            {address ? "Change" : "Add"}
                        </button>
                    </div>

                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span>
                        <span>Rs.{getTotalCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>Rs.{deliveryCost}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>
                            Rs.{getTotalCartAmount() + deliveryCost}
                        </span>
                    </p>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
