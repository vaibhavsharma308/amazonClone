import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, CreditCard, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export default function OrderConfirmation() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            axios.get(`${API_BASE_URL}/api/orders/${id}`),
            axios.get(`${API_BASE_URL}/api/payments/order/${id}`).catch(() => ({ data: null }))
        ]).then(([orderRes, paymentRes]) => {
            setOrder(orderRes.data)
            setPayment(paymentRes.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [id])

    if (loading) return <div className="page-container"><p className="loading">Loading order details...</p></div>
    if (!order) return <div className="page-container"><p className="error">Order not found.</p></div>

    return (
        <div className="page-container">
            <div className="confirmation-card">
                <CheckCircle size={64} className="success-icon" />
                <h1>Order Placed Successfully!</h1>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-email">A confirmation will be sent to <strong>{order.email}</strong></p>

                <div className="confirmation-details">
                    {/* Payment Info */}
                    {payment && (
                        <div className="confirmation-section payment-info-section">
                            <h3><CreditCard size={18} /> Payment Details</h3>
                            <div className="payment-status-badge success">
                                <ShieldCheck size={14} />
                                Payment Successful
                            </div>
                            <div className="payment-detail-grid">
                                <div className="payment-detail-item">
                                    <span className="detail-label">Transaction ID</span>
                                    <span className="detail-value">{payment.transactionId}</span>
                                </div>
                                <div className="payment-detail-item">
                                    <span className="detail-label">Card</span>
                                    <span className="detail-value">•••• •••• •••• {payment.cardLastFour}</span>
                                </div>
                                <div className="payment-detail-item">
                                    <span className="detail-label">Amount Paid</span>
                                    <span className="detail-value">${payment.amount.toFixed(2)}</span>
                                </div>
                                <div className="payment-detail-item">
                                    <span className="detail-label">Cardholder</span>
                                    <span className="detail-value">{payment.cardHolderName}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="confirmation-section">
                        <h3>Shipping Address</h3>
                        <p>{order.customerName}</p>
                        <p>{order.shippingAddress}</p>
                        <p>{order.city}, {order.zipCode}</p>
                    </div>

                    <div className="confirmation-section">
                        <h3>Order Items</h3>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="confirmation-item">
                                <Package size={16} />
                                <span>{item.productName} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total Paid</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <Link to="/" className="btn-primary">Continue Shopping</Link>
            </div>
        </div>
    )
}
