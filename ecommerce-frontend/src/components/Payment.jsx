import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import axios from 'axios'

export default function Payment() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [error, setError] = useState('')

    const [card, setCard] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiry: '',
        cvv: ''
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/api/orders/${orderId}`)
            .then(res => { setOrder(res.data); setLoading(false) })
            .catch(() => { setError('Order not found'); setLoading(false) })
    }, [orderId])

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, '').substring(0, 16)
        return cleaned.replace(/(.{4})/g, '$1 ').trim()
    }

    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '').substring(0, 4)
        if (cleaned.length >= 3) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2)
        }
        return cleaned
    }

    const getCardType = (number) => {
        const cleaned = number.replace(/\s/g, '')
        if (cleaned.startsWith('4')) return 'visa'
        if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard'
        if (/^3[47]/.test(cleaned)) return 'amex'
        if (/^6(?:011|5)/.test(cleaned)) return 'discover'
        return 'generic'
    }

    const getCardTypeLabel = (type) => {
        const labels = { visa: 'VISA', mastercard: 'MASTERCARD', amex: 'AMEX', discover: 'DISCOVER', generic: '' }
        return labels[type]
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'cardNumber') {
            setCard(prev => ({ ...prev, cardNumber: formatCardNumber(value) }))
        } else if (name === 'expiry') {
            setCard(prev => ({ ...prev, expiry: formatExpiry(value) }))
        } else if (name === 'cvv') {
            setCard(prev => ({ ...prev, cvv: value.replace(/\D/g, '').substring(0, 4) }))
        } else {
            setCard(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setProcessing(true)
        setError('')

        try {
            await axios.post('http://localhost:8080/api/payments/process', {
                orderId: parseInt(orderId),
                cardNumber: card.cardNumber,
                cardHolderName: card.cardHolderName,
                amount: order.totalAmount
            })

            setPaymentSuccess(true)
            clearCart()

            setTimeout(() => {
                navigate(`/order-confirmation/${orderId}`)
            }, 2000)
        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed. Please try again.')
            setProcessing(false)
        }
    }

    if (loading) return <div className="page-container"><p className="loading">Loading order details...</p></div>
    if (!order && error) return <div className="page-container"><p className="error">{error}</p></div>

    const cardType = getCardType(card.cardNumber)

    if (paymentSuccess) {
        return (
            <div className="page-container">
                <div className="payment-success-overlay">
                    <div className="payment-success-card">
                        <div className="success-checkmark">
                            <ShieldCheck size={64} />
                        </div>
                        <h2>Payment Successful!</h2>
                        <p>Redirecting to order confirmation...</p>
                        <div className="success-loader"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Payment</h1>
            <div className="payment-layout">
                {/* Visual Card Preview */}
                <div className="payment-card-section">
                    <div className={`credit-card-preview ${cardType}`}>
                        <div className="card-chip"></div>
                        <div className="card-type-badge">{getCardTypeLabel(cardType)}</div>
                        <div className="card-number-display">
                            {card.cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className="card-bottom-row">
                            <div className="card-holder-display">
                                <span className="card-label">CARD HOLDER</span>
                                <span className="card-value">{card.cardHolderName || 'YOUR NAME'}</span>
                            </div>
                            <div className="card-expiry-display">
                                <span className="card-label">EXPIRES</span>
                                <span className="card-value">{card.expiry || 'MM/YY'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form className="payment-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="cardNumber">
                                <CreditCard size={16} /> Card Number
                            </label>
                            <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                required
                                value={card.cardNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                autoComplete="cc-number"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardHolderName">Cardholder Name</label>
                            <input
                                id="cardHolderName"
                                name="cardHolderName"
                                type="text"
                                required
                                value={card.cardHolderName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                autoComplete="cc-name"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="expiry">Expiry Date</label>
                                <input
                                    id="expiry"
                                    name="expiry"
                                    type="text"
                                    required
                                    value={card.expiry}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    autoComplete="cc-exp"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">
                                    <Lock size={14} /> CVV
                                </label>
                                <input
                                    id="cvv"
                                    name="cvv"
                                    type="password"
                                    required
                                    value={card.cvv}
                                    onChange={handleChange}
                                    placeholder="•••"
                                    maxLength={4}
                                    autoComplete="cc-csc"
                                />
                            </div>
                        </div>

                        {error && <div className="payment-error">{error}</div>}

                        <button type="submit" className="btn-pay" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />
                                    Pay ${order?.totalAmount?.toFixed(2)}
                                </>
                            )}
                        </button>

                        <div className="payment-security-note">
                            <ShieldCheck size={14} />
                            <span>Your payment is secured with 256-bit SSL encryption</span>
                        </div>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <p className="summary-order-id">Order #{orderId}</p>
                    {order?.items?.map((item, idx) => (
                        <div key={idx} className="summary-item">
                            {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="summary-item-image" />}
                            <div className="summary-item-info">
                                <span>{item.productName}</span>
                                <span className="summary-item-qty">Qty: {item.quantity}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${order?.totalAmount?.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
