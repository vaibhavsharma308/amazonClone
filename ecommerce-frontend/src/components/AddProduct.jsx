import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export default function AddProduct() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        name: '', price: '', description: '', imageUrl: '',
        category: 'Electronics', stock: '',
    })

    const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Toys', 'Health', 'Automotive']

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await axios.post(`${API_BASE_URL}/api/products`, {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                sellerId: user.id,
                sellerName: user.name,
                rating: 0,
                reviewCount: 0,
            })
            navigate('/seller')
        } catch (err) {
            console.error('Failed to add product:', err)
        }
        setSaving(false)
    }

    if (!user) {
        navigate('/login')
        return null
    }

    return (
        <div className="page-container">
            <Link to="/seller" className="back-link">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="seller-form-card">
                <h1 className="seller-form-title">Add New Product</h1>
                <p className="seller-form-subtitle">Fill in the details below to list a new product</p>

                <form onSubmit={handleSubmit} className="seller-form">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            placeholder="e.g. Wireless Bluetooth Speaker" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($) *</label>
                            <input name="price" type="number" step="0.01" min="0.01"
                                value={form.price} onChange={handleChange} placeholder="29.99" required />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input name="stock" type="number" min="0"
                                value={form.stock} onChange={handleChange} placeholder="100" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} className="form-select">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                            placeholder="Describe your product features, specs, etc."
                            rows={4} required className="form-textarea" />
                    </div>

                    <div className="form-group">
                        <label>Image URL *</label>
                        <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                            placeholder="https://images.unsplash.com/photo-..." required />
                    </div>

                    {form.imageUrl && (
                        <div className="image-preview">
                            <img src={form.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    )}

                    <button type="submit" className="btn-primary full-width" disabled={saving}>
                        {saving ? 'Publishing...' : <><Upload size={18} /> Publish Product</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
