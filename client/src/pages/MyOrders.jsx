import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { dummyOrders } from '../assets/assets'
import { generateInvoicePDF } from '../utils/invoicePDF'
import toast from 'react-hot-toast'

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const [activeTab, setActiveTab] = useState("Ongoing")
    const { currency, axios, user } = useAppContext()

    const fetchMyOrders = async () => {
        try {
            console.log('Fetching user orders...');
            const { data } = await axios.get('/api/order/user')
            console.log('Orders response:', data);
            if (data.success) {
                console.log("Orders received:", data.orders);
                setMyOrders(data.orders)
            } else {
                toast.error(data.message);
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // Filter orders based on status
    const getOrdersByCategory = (category) => {
        if (category === "Ongoing") {
            return myOrders.filter(order =>
                order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Trash"
            ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (category === "Delivered") {
            return myOrders.filter(order => order.status === "Delivered")
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return [];
    }

    const getOrderCount = (category) => {
        return getOrdersByCategory(category).length;
    }

    const filteredOrders = getOrdersByCategory(activeTab);

    const downloadInvoice = (order) => {
        try {
            console.log("Downloading invoice for order:", order);

            // Prepare order data for PDF
            const orderForPDF = {
                _id: order._id,
                date: order.createdAt,
                items: order.items.map(item => ({
                    name: item.product?.name || 'Unknown Product',
                    quantity: item.quantity,
                    price: item.product?.offerPrice || item.product?.price || 0
                })),
                amount: order.totalAmount || order.amount, // Use totalAmount if available, fallback to amount
                deliveryFee: order.deliveryFee || order.deliveryCost || 0,
                address: order.address
            };

            console.log("Full order object:", order);
            console.log("Order data for PDF:", orderForPDF);
            console.log("Amount fields - totalAmount:", order.totalAmount, "amount:", order.amount);
            console.log("Delivery fee fields - deliveryFee:", order.deliveryFee, "deliveryCost:", order.deliveryCost);

            const fileName = generateInvoicePDF(
                orderForPDF,
                user,
                order.paymentDetails?.razorpay_payment_id || `ORDER_${order._id.slice(-8)}`
            );

            toast.success(`Invoice downloaded: ${fileName}`);
        } catch (error) {
            console.error("PDF generation error:", error);
            console.error("Error details:", error.stack);
            toast.error("Failed to generate invoice");
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyOrders()
        }
    }, [user])

    return (
        <div className='mt-16 pb-16 px-4 md:px-8'>
            <div className='flex flex-col items-center md:items-end w-full md:w-max mb-8'>
                <p className='text-3xl font-serif font-medium text-tulunad-secondary'>Your Orders</p>
                <div className='w-20 h-1 bg-tulunad-primary rounded-full mt-2'></div>
            </div>

            {/* Category Tabs */}
            <div className="mb-6 flex gap-4 justify-center md:justify-start max-w-4xl mx-auto">
                <button
                    onClick={() => setActiveTab("Ongoing")}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === "Ongoing"
                            ? 'bg-tulunad-primary text-white shadow-md'
                            : 'bg-white border border-stone-200 text-stone-600 hover:text-tulunad-primary'
                        }`}
                >
                    Ongoing
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === "Ongoing"
                            ? 'bg-white/20'
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                        {getOrderCount("Ongoing")}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("Delivered")}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === "Delivered"
                            ? 'bg-tulunad-primary text-white shadow-md'
                            : 'bg-white border border-stone-200 text-stone-600 hover:text-tulunad-primary'
                        }`}
                >
                    Delivered
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === "Delivered"
                            ? 'bg-white/20'
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                        {getOrderCount("Delivered")}
                    </span>
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg max-w-4xl mx-auto">
                    <p className='text-gray-500'>No {activeTab.toLowerCase()} orders found</p>
                </div>
            ) : (
                filteredOrders.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg mb-6 p-3 md:p-4 md:py-5 w-full max-w-4xl mx-auto'>
                        {/* Order Header - Mobile Responsive */}
                        <div className='flex flex-col gap-3 mb-4'>
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-600 text-sm'>
                                <div className='flex flex-wrap items-center gap-2'>
                                    <span className='font-medium'>OrderId: <span className='font-normal break-all'>{order._id}</span></span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Delivered"
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === "Cancelled"
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className='flex flex-wrap items-center gap-2'>
                                    <span>Payment: {order.paymentType}</span>
                                    <span className='font-medium text-primary'>Total: Rs.{order.totalAmount || order.amount}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => downloadInvoice(order)}
                                className="bg-primary hover:bg-primary-dull text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download Invoice
                            </button>
                        </div>
                        {/* Order Items - Mobile Responsive */}
                        {order.items.map((item, index) => (
                            <div key={index}
                                className={`${order.items.length !== index + 1 && "border-b border-gray-200"
                                    } py-4 last:pb-0`}>

                                {/* Product Info */}
                                <div className='flex items-start gap-3 mb-3'>
                                    <div className='bg-primary/10 p-2 rounded-lg flex-shrink-0'>
                                        <img src={item.product?.image?.[0] || '/placeholder.png'} alt="" className='w-12 h-12 md:w-16 md:h-16 object-cover rounded' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-base md:text-lg font-medium text-gray-800 mb-1'>{item.product?.name || 'Product Unavailable'}</h3>
                                        <p className='text-sm text-gray-500 mb-2'>Category: {item.product?.category || 'N/A'}</p>
                                        <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                                            <span>Qty: {item.quantity || "1"}</span>
                                            <span className='col-span-2'>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className='text-right flex-shrink-0'>
                                        <p className='text-primary text-base md:text-lg font-medium'>
                                            Rs.{(item.product?.offerPrice || 0) * item.quantity}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                ))
            )}

        </div>
    )
}

export default MyOrders
