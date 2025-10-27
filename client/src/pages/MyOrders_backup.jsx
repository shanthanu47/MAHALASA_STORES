import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { dummyOrders } from '../assets/assets'
import { generateInvoicePDF } from '../utils/invoicePDF'
import { toast } from 'react-toastify'

const MyOrders = () => {
    const { user, token, currency, backendUrl } = useAppContext()
    const [orderData, setOrderData] = useState([])

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }
            const response = await fetch(backendUrl + '/api/order/userorders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await response.json()

            if (response.ok) {
                let allOrdersItem = []
                data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        allOrdersItem.push(item)
                    })
                })
                setOrderData(allOrdersItem)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const downloadInvoice = async (order) => {
        try {
            const orderForPDF = {
                orderId: order._id,
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
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice');
        }
    };

    useEffect(() => {
        loadOrderData()
    }, [token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <h1>MY ORDERS</h1>
            </div>

            <div>
                {orderData.map((item, index) => (
                    <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-start gap-6 text-sm'>
                            <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                            <div>
                                <p className='sm:text-base font-medium'>{item.name}</p>
                                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                    <p className='text-lg'>{currency}{item.price}</p>
                                    <p>Quantity: {item.size}</p>
                                    <p>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                </div>
                            </div>
                        </div>
                        <div className='md:w-1/2 flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                <p className='text-sm md:text-base'>{item.status}</p>
                            </div>
                            <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders
