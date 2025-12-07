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
        clearCart,
        getTotalCartAmount,
        getCartCount,
        user,
        navigate,
        axios,
        address,
        getAddress,
    } = useAppContext();

    const [showAddressConfirm, setShowAddressConfirm] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);

    useEffect(() => {
        if (user) {
            getAddress();
        }
    }, [user, getAddress]);

    const handleProceedToCheckout = async () => {
        if (!address) {
            toast.error("Please add a delivery address first");
            navigate("/add-address");
            return;
        }
        
        // Fetch order details with delivery charges
        setIsLoadingOrder(true);
        const orderItems = Object.keys(cart).map((key) => ({
            product: key,
            quantity: cart[key],
        }));

        try {
            const { data: orderData } = await axios.post(
                "/api/order/create-razorpay-order",
                {
                    items: orderItems,
                    address: address._id,
                }
            );

            if (orderData.success) {
                // Store order summary to display in modal
                setOrderSummary({
                    items: orderItems.map(item => {
                        const product = products.find(p => p._id === item.product);
                        return {
                            name: product?.name || 'Unknown Product',
                            quantity: item.quantity,
                            price: product?.offerPrice || 0,
                            total: (product?.offerPrice || 0) * item.quantity
                        };
                    }),
                    itemTotal: orderData.amounts.itemTotal,
                    deliveryCost: orderData.amounts.deliveryCost,
                    totalAmount: orderData.amounts.totalAmount,
                    razorpayOrderId: orderData.order.id,
                    razorpayAmount: orderData.order.amount
                });
                setShowAddressConfirm(true);
            } else {
                toast.error(orderData.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoadingOrder(false);
        }
    }

    const handleAddressConfirmed = () => {
        setShowAddressConfirm(false);
        placeOrderWithSummary();
    }

    const handleChangeAddress = () => {
        setShowAddressConfirm(false);
        setOrderSummary(null);
        navigate("/add-address");
    }

    const placeOrderWithSummary = async () => {
        if (!orderSummary) return;
        
        const orderItems = Object.keys(cart).map((key) => ({
            product: key,
            quantity: cart[key],
        }));

        try {
            if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
                toast.error("Razorpay configuration error. Please contact support.");
                return;
            }
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderSummary.razorpayAmount,
                currency: "INR",
                name: "Mahalasa Stores",
                description: "Order Payment",
                order_id: orderSummary.razorpayOrderId,
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
                                // Clear cart on successful order
                                await clearCart();
                                
                                toast.success(data.message);
                                
                                // Generate and download invoice PDF
                                try {
                                    const orderForPDF = {
                                        _id: data.orderId || orderSummary.razorpayOrderId,
                                        date: new Date(),
                                        items: orderSummary.items,
                                        amount: orderSummary.totalAmount,
                                        deliveryFee: orderSummary.deliveryCost,
                                        address: address
                                    };
                                    
                                    const fileName = generateInvoicePDF(
                                        orderForPDF,
                                        user,
                                        response.razorpay_payment_id
                                    );
                                    
                                    toast.success(`Invoice downloaded: ${fileName}`);
                                } catch (pdfError) {
                                    console.error("PDF generation error:", pdfError);
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
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row mt-16">
            {/* Address Confirmation Modal */}
            {showAddressConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => {
                                setShowAddressConfirm(false);
                                setOrderSummary(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-2xl font-semibold mb-4 pr-8">Order Summary</h3>
                        
                        {/* Loading State */}
                        {isLoadingOrder && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-gray-600 mt-2">Calculating order details...</p>
                            </div>
                        )}
                        
                        {/* Order Summary Content */}
                        {!isLoadingOrder && orderSummary && (
                            <>
                                {/* Items List */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Order Items</h4>
                                    <div className="border rounded-lg divide-y">
                                        {orderSummary.items.map((item, index) => (
                                            <div key={index} className="p-3 flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <p className="font-semibold text-gray-900">₹{item.total}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between py-2 text-gray-700">
                                        <span>Items Subtotal</span>
                                        <span>₹{orderSummary.itemTotal}</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-gray-700">
                                        <span>Delivery Charges</span>
                                        <span>₹{orderSummary.deliveryCost}</span>
                                    </div>
                                    <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
                                        <span>Total Amount</span>
                                        <span>₹{orderSummary.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-lg mb-2 text-gray-800">Delivery Address</h4>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="font-medium text-gray-800">{address.firstName} {address.lastName}</p>
                                        <p className="text-gray-700">{address.street}</p>
                                        <p className="text-gray-700">{address.city}, {address.state}</p>
                                        <p className="text-gray-700">{address.zipcode}, {address.country}</p>
                                        <p className="text-gray-700 mt-2">Phone: {address.phone}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleChangeAddress}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
                                    >
                                        Change Address
                                    </button>
                                    <button
                                        onClick={handleAddressConfirmed}
                                        className="flex-1 px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-dull transition font-medium"
                                    >
                                        Confirm & Pay ₹{orderSummary.totalAmount}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm text-primary">
                        {getCartCount()} Items
                    </span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {getCartCount() === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                        <button
                            onClick={() => {
                                navigate("/products");
                                scrollTo(0, 0);
                            }}
                            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dull transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500 text-sm">
                            {address
                                ? `${address.firstName} ${address.lastName}, ${address.street}, ${address.city}`
                                : "No address found"}
                        </p>
                        <button
                            onClick={() => navigate("/add-address")}
                            className="text-primary hover:underline cursor-pointer text-sm whitespace-nowrap ml-2"
                        >
                            {address ? "Change" : "Add"}
                        </button>
                    </div>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs.{getTotalCartAmount()}</span>
                    </p>
                    <p className="flex justify-between text-xs text-gray-400">
                        <span>Delivery charges</span>
                        <span>Calculated at checkout</span>
                    </p>
                </div>

                <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
