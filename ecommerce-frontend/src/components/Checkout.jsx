import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import axios from 'axios'

export default function Checkout() {
    const { cartItems, cartTotal, cartCount } = useCart()
    const navigate = useNavigate()
    const [form, setForm] = useState({ customerName: '', email: '', shippingAddress: '', city: '', zipCode: '' })
    const [submitting, setSubmitting] = useState(false)

    const shippingCost = cartTotal > 50 ? 0 : 5.99
    const finalTotal = cartTotal + shippingCost

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const order = {
            ...form,
            totalAmount: finalTotal,
            items: cartItems.map(item => ({
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl,
            }))
        }

        try {
            const res = await axios.post('http://localhost:8080/api/orders', order)
            navigate(`/payment/${res.data.id}`)
        } catch (err) {
            console.error('Order failed:', err)
            alert('Failed to create order. Please try again.')
            setSubmitting(false)
        }
    }

    if (cartItems.length === 0) {
        navigate('/')
        return null
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Checkout</h1>

            {/* Progress Steps */}
            <div className="checkout-steps">
                <div className="step active">
                    <div className="step-number">1</div>
                    <span>Shipping</span>
                </div>
                <div className="step-line"></div>
                <div className="step">
                    <div className="step-number">2</div>
                    <span>Payment</span>
                </div>
                <div className="step-line"></div>
                <div className="step">
                    <div className="step-number">3</div>
                    <span>Confirm</span>
                </div>
            </div>

            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h3>Shipping Information</h3>
                    <div className="form-group">
                        <label htmlFor="customerName">Full Name</label>
                        <input id="customerName" name="customerName" type="text" required value={form.customerName} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shippingAddress">Shipping Address</label>
                        <input id="shippingAddress" name="shippingAddress" type="text" required value={form.shippingAddress} onChange={handleChange} placeholder="123 Main St, Apt 4" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} placeholder="New York" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="zipCode">ZIP Code</label>
                            <input id="zipCode" name="zipCode" type="text" required value={form.zipCode} onChange={handleChange} placeholder="10001" />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary full-width" disabled={submitting}>
                        {submitting ? 'Processing...' : `Continue to Payment • $${finalTotal.toFixed(2)}`}
                    </button>
                </form>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                            <img src={item.imageUrl} alt={item.name} className="summary-item-image" />
                            <div className="summary-item-info">
                                <span>{item.name}</span>
                                <span className="summary-item-qty">Qty: {item.quantity}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="summary-row"><span>Subtotal ({cartCount} items)</span><span>${cartTotal.toFixed(2)}</span></div>
                    <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    )
}
