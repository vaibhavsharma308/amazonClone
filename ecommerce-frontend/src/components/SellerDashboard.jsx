import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Plus, Edit3, Trash2, DollarSign, BarChart3, TrendingUp, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function SellerDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        fetchProducts()
    }, [user, navigate])

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products/seller/${user.id}`)
            setProducts(res.data)
        } catch (err) {
            console.error('Failed to fetch seller products:', err)
        }
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`)
            setProducts(products.filter(p => p.id !== id))
        } catch (err) {
            console.error('Failed to delete product:', err)
        }
    }

    if (!user) return null

    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.reviewCount * 0.1), 0)
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const avgRating = products.length > 0
        ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
        : 0

    return (
        <div className="page-container">
            <div className="seller-header">
                <div>
                    <h1 className="page-title">Seller Dashboard</h1>
                    <p className="seller-subtitle">Welcome back, {user.name}! Manage your products and track performance.</p>
                </div>
                <Link to="/seller/add-product" className="btn-primary">
                    <Plus size={18} /> Add New Product
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="seller-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255,153,0,0.1)', color: '#ff9900' }}>
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{products.length}</span>
                        <span className="stat-label">Total Products</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">${totalRevenue.toFixed(0)}</span>
                        <span className="stat-label">Est. Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalStock}</span>
                        <span className="stat-label">Total Stock</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">⭐ {avgRating}</span>
                        <span className="stat-label">Avg Rating</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="seller-table-card">
                <div className="table-header">
                    <h2><Store size={20} /> Your Products</h2>
                </div>

                {loading ? (
                    <div className="loading">Loading your products...</div>
                ) : products.length === 0 ? (
                    <div className="seller-empty">
                        <Package size={48} />
                        <h3>No products yet</h3>
                        <p>Start selling by adding your first product!</p>
                        <Link to="/seller/add-product" className="btn-primary" style={{ marginTop: 16 }}>
                            <Plus size={18} /> Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="seller-products-list">
                        {products.map(product => (
                            <div key={product.id} className="seller-product-row">
                                <img src={product.imageUrl} alt={product.name} className="seller-product-img" />
                                <div className="seller-product-info">
                                    <h3>{product.name}</h3>
                                    <span className="seller-product-cat">{product.category}</span>
                                </div>
                                <div className="seller-product-price">${product.price.toFixed(2)}</div>
                                <div className="seller-product-stock">
                                    <span className={`stock-indicator ${product.stock < 10 ? 'low' : ''}`}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                                <div className="seller-product-rating">⭐ {product.rating}</div>
                                <div className="seller-product-actions">
                                    <Link to={`/seller/edit-product/${product.id}`} className="action-btn edit">
                                        <Edit3 size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="action-btn delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
