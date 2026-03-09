import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, ArrowLeft, Package, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import axios from 'axios'

export default function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(res => { setProduct(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) return <div className="page-container"><p className="loading">Loading...</p></div>
    if (!product) return <div className="page-container"><p className="error">Product not found.</p></div>

    return (
        <div className="page-container">
            <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to products</Link>
            <div className="product-detail">
                <div className="detail-image-container">
                    <img src={product.imageUrl} alt={product.name} className="detail-image" />
                </div>
                <div className="detail-info">
                    <span className="product-category">{product.category}</span>
                    <h1>{product.name}</h1>
                    <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18}
                                fill={i < Math.round(product.rating) ? '#ffa41c' : 'none'}
                                stroke="#ffa41c" />
                        ))}
                        <span>{product.rating}</span>
                        <span className="review-count">({product.reviewCount?.toLocaleString()} reviews)</span>
                    </div>
                    <div className="detail-price">${product.price.toFixed(2)}</div>
                    <p className="detail-description">{product.description}</p>

                    <div className="detail-meta">
                        <div className="meta-item">
                            <Package size={18} />
                            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                        </div>
                        <div className="meta-item">
                            <Truck size={18} />
                            <span>Free shipping on orders over $50</span>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>
                        <button className="add-to-cart-btn large" onClick={handleAddToCart} disabled={product.stock === 0}>
                            {added ? '✓ Added!' : <><ShoppingCart size={18} /> Add to Cart</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
