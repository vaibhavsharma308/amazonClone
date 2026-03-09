import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Building, Hash, Edit3, Save, LogOut, Package, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
    const { user, updateProfile, logout } = useAuth()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        name: '', phone: '', address: '', city: '', zipCode: ''
    })
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        setForm({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            zipCode: user.zipCode || '',
        })
    }, [user, navigate])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateProfile(form)
            setEditing(false)
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Failed to update profile:', err)
        }
        setSaving(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (!user) return null

    return (
        <div className="page-container">
            <h1 className="page-title">Your Account</h1>

            {success && <div className="profile-success">{success}</div>}

            <div className="profile-layout">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="avatar-info">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-divider"></div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <div className="field-icon"><User size={18} /></div>
                            <div className="field-content">
                                <label>Full Name</label>
                                {editing ? (
                                    <input name="name" value={form.name} onChange={handleChange} />
                                ) : (
                                    <span>{user.name || '—'}</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-icon"><Mail size={18} /></div>
                            <div className="field-content">
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-icon"><Phone size={18} /></div>
                            <div className="field-content">
                                <label>Phone</label>
                                {editing ? (
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
                                ) : (
                                    <span>{user.phone || 'Not added yet'}</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-icon"><MapPin size={18} /></div>
                            <div className="field-content">
                                <label>Address</label>
                                {editing ? (
                                    <input name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />
                                ) : (
                                    <span>{user.address || 'Not added yet'}</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-icon"><Building size={18} /></div>
                            <div className="field-content">
                                <label>City</label>
                                {editing ? (
                                    <input name="city" value={form.city} onChange={handleChange} placeholder="Enter city" />
                                ) : (
                                    <span>{user.city || 'Not added yet'}</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="field-icon"><Hash size={18} /></div>
                            <div className="field-content">
                                <label>ZIP Code</label>
                                {editing ? (
                                    <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Enter ZIP code" />
                                ) : (
                                    <span>{user.zipCode || 'Not added yet'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {editing ? (
                            <>
                                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                            </>
                        ) : (
                            <button className="btn-primary" onClick={() => setEditing(true)}>
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="profile-sidebar">
                    <Link to="/orders" className="profile-link-card">
                        <Package size={22} />
                        <div>
                            <h3>Your Orders</h3>
                            <p>Track, return, or buy again</p>
                        </div>
                        <ChevronRight size={20} />
                    </Link>

                    <Link to="/cart" className="profile-link-card">
                        <span className="link-emoji">🛒</span>
                        <div>
                            <h3>Your Cart</h3>
                            <p>View items in your cart</p>
                        </div>
                        <ChevronRight size={20} />
                    </Link>

                    <button className="profile-link-card danger" onClick={handleLogout}>
                        <LogOut size={22} />
                        <div>
                            <h3>Sign Out</h3>
                            <p>Logout from your account</p>
                        </div>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
