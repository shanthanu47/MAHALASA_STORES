import React from 'react';
import { assets } from '../../assets/assets';
import './invoice.css';

const Invoice = ({ order, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-modal">
            <div className="invoice-content">
                <div className="invoice-header">
                    <img src={assets.logo} alt="logo" className="logo" />
                    <div className="website-details">
                        <p>Mahalasa Stores</p>
                        <p>123 Green St, Food City</p>
                        <p>contact@mahalasastores.com</p>
                    </div>
                </div>
                <div className="customer-details">
                    <h2>Invoice To:</h2>
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}, {order.address.city}</p>
                    <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                </div>
                <div className="order-details">
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> {order.paymentType}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>Rs.{item.product.offerPrice}</td>
                                <td>Rs.{item.product.offerPrice * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="invoice-total">
                    <p><strong>Total Amount:</strong> Rs.{order.amount}</p>
                </div>
                <div className="invoice-buttons">
                    <button onClick={handlePrint} className="print-btn">Print</button>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;