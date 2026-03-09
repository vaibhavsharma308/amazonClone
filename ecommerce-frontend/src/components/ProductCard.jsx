import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
    }

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-wrapper">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                {product.stock < 10 && product.stock > 0 && (
                    <span className="stock-badge low">Only {product.stock} left!</span>
                )}
                {product.stock === 0 && (
                    <span className="stock-badge out">Out of Stock</span>
                )}
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                    <Star size={14} fill="#ffa41c" stroke="#ffa41c" />
                    <span>{product.rating}</span>
                    <span className="review-count">({product.reviewCount?.toLocaleString()})</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
                        <ShoppingCart size={16} /> Add
                    </button>
                </div>
            </div>
        </Link>
    )
}
