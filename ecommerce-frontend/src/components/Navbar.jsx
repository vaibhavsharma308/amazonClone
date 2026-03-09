import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
    const { cartCount } = useCart()
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`)
        } else {
            navigate('/')
        }
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <h2>amazon</h2>
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search products, brands, and more..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">
                    <Search size={18} />
                </button>
            </form>

            <div className="nav-right">
                {user ? (
                    <Link to="/profile" className="nav-user-btn">
                        <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                        <span className="nav-username">{user.name?.split(' ')[0]}</span>
                    </Link>
                ) : (
                    <Link to="/login" className="nav-link">
                        <User size={18} />
                        <span>Sign In</span>
                    </Link>
                )}
                <Link to="/orders" className="nav-link">Orders</Link>
                {user && <Link to="/seller" className="nav-link sell-link">Sell</Link>}
                <Link to="/cart" className="cart-icon">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
            </div>
        </nav>
    )
}
