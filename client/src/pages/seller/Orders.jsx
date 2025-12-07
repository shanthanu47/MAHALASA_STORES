import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import Invoice from '../../components/seller/Invoice'

const Orders = () => {
    const { axios } = useAppContext()
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showInvoice, setShowInvoice] = useState(false)
    const [activeTab, setActiveTab] = useState("Order Placed")

    const orderStatuses = [
        "Order Placed",
        "Processing", 
        "Packed",
        "Dispatched",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Trash"
    ]

    const fetchOrders = async () => {
        try {
            console.log('Fetching seller orders...');
            const { data } = await axios.get('/api/order/seller');
            console.log('Orders response:', data);
            if (data.success) {
                setOrders(data.orders)
                console.log('Orders set:', data.orders);
            } else {
                toast.error(data.message)
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || error.message)
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const { data } = await axios.post('/api/order/status', { orderId, status });
            if (data.success) {
                toast.success(data.message)
                fetchOrders()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to move this order to trash?')) {
            return;
        }
        try {
            const { data } = await axios.post('/api/order/delete', { orderId });
            if (data.success) {
                toast.success(data.message)
                fetchOrders()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const permanentDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone!')) {
            return;
        }
        try {
            const { data } = await axios.post('/api/order/permanent-delete', { orderId });
            if (data.success) {
                toast.success(data.message)
                fetchOrders()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    const handlePrintInvoice = (order) => {
        setSelectedOrder(order)
        setShowInvoice(true)
    }

    // Group orders by status
    const getOrdersByStatus = (status) => {
        return orders
            .filter(order => order.status === status)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Most recent first
    }

    // Get count for each status
    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length
    }

    // Format time
    const formatOrderTime = (date) => {
        const orderDate = new Date(date)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const isToday = orderDate.toDateString() === today.toDateString()
        const isYesterday = orderDate.toDateString() === yesterday.toDateString()

        const time = orderDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        })

        if (isToday) {
            return `Today at ${time}`
        } else if (isYesterday) {
            return `Yesterday at ${time}`
        } else {
            return `${orderDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: orderDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            })} at ${time}`
        }
    }

    const filteredOrders = getOrdersByStatus(activeTab)

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Orders Management</h2>
                
                {/* Status Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-2">
                        {orderStatuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === status
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === status 
                                        ? 'bg-white/20' 
                                        : 'bg-gray-300'
                                }`}>
                                    {getStatusCount(status)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No orders in "{activeTab}" status</p>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <div key={order._id} className="flex flex-col gap-4 p-5 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow">
                                
                                {/* Order Header with Time */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">ORDER #{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {formatOrderTime(order.createdAt)}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-5 md:items-start">
                                    {/* Product Info */}
                                    <div className="flex gap-4 flex-1 min-w-0">
                                        <img className="w-14 h-14 object-cover rounded-md flex-shrink-0" src={assets.box_icon} alt="boxIcon" />
                                        <div className="min-w-0">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="mb-1">
                                                    <p className="font-medium text-gray-800 truncate">
                                                        {item.product?.name || 'Product Unavailable'}{" "}
                                                        <span className="text-primary font-semibold">x {item.quantity}</span>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="text-sm text-gray-600 flex-1 min-w-0">
                                        <p className='text-gray-800 font-medium mb-1'>
                                            {order.address?.firstName} {order.address?.lastName}
                                        </p>
                                        <p className="truncate">{order.address?.street}, {order.address?.city}</p>
                                        <p className="truncate">{order.address?.state}, {order.address?.zipcode}</p>
                                        <p className="mt-1 font-medium">{order.address?.phone}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex flex-col items-start md:items-end gap-1">
                                        <p className="font-semibold text-lg text-gray-800">
                                            Rs.{order.totalAmount || order.amount}
                                        </p>
                                        <p className="text-xs text-gray-500">{order.paymentType}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            order.isPaid 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                                    {activeTab === "Trash" ? (
                                        // Trash actions - Restore or Permanently Delete
                                        <>
                                            <button
                                                onClick={() => updateStatus(order._id, "Order Placed")}
                                                className="flex-1 min-w-[150px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Restore Order
                                            </button>
                                            <button
                                                onClick={() => permanentDeleteOrder(order._id)}
                                                className="flex-1 min-w-[150px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Forever
                                            </button>
                                        </>
                                    ) : (
                                        // Normal actions
                                        <>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                            >
                                                {orderStatuses.filter(s => s !== "Trash").map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            <button 
                                                onClick={() => handlePrintInvoice(order)} 
                                                className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Print Invoice
                                            </button>
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Trash
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {showInvoice && <Invoice order={selectedOrder} onClose={() => setShowInvoice(false)} />}
        </div>
    )
}

export default Orders
