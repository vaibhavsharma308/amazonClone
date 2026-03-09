import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

    if (cartItems.length === 0) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything yet.</p>
                    <Link to="/" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Shopping Cart ({cartCount} items)</h1>
            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                                <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                <div className="cart-item-actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                            <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{cartTotal > 50 ? 'FREE' : '$5.99'}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${(cartTotal > 50 ? cartTotal : cartTotal + 5.99).toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="btn-primary full-width">Proceed to Checkout</Link>
                </div>
            </div>
        </div>
    )
}
