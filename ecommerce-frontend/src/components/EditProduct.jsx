import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export default function EditProduct() {
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({
        name: '', price: '', description: '', imageUrl: '',
        category: '', stock: '',
    })

    const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Toys', 'Health', 'Automotive']

    useEffect(() => {
        if (!user) { navigate('/login'); return }
        fetchProduct()
    }, [user, id])

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products/${id}`)
            const p = res.data
            setForm({
                name: p.name, price: p.price, description: p.description,
                imageUrl: p.imageUrl, category: p.category, stock: p.stock,
            })
        } catch (err) {
            console.error('Failed to fetch product:', err)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await axios.put(`${API_BASE_URL}/api/products/${id}`, {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                sellerId: user.id,
                sellerName: user.name,
            })
            navigate('/seller')
        } catch (err) {
            console.error('Failed to update product:', err)
        }
        setSaving(false)
    }

    if (loading) return <div className="page-container"><div className="loading">Loading product...</div></div>

    return (
        <div className="page-container">
            <Link to="/seller" className="back-link">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="seller-form-card">
                <h1 className="seller-form-title">Edit Product</h1>
                <p className="seller-form-subtitle">Update the product details below</p>

                <form onSubmit={handleSubmit} className="seller-form">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($) *</label>
                            <input name="price" type="number" step="0.01" min="0.01"
                                value={form.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input name="stock" type="number" min="0"
                                value={form.stock} onChange={handleChange} required />
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
                            rows={4} required className="form-textarea" />
                    </div>

                    <div className="form-group">
                        <label>Image URL *</label>
                        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
                    </div>

                    {form.imageUrl && (
                        <div className="image-preview">
                            <img src={form.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    )}

                    <button type="submit" className="btn-primary full-width" disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
