import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        if (!user || !user.email) {
            setLoading(false)
            return
        }

        axios.get(`${API_BASE_URL}/api/orders?email=${encodeURIComponent(user.email)}`)
            .then(res => { setOrders(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [user])

    if (loading) return <div className="page-container"><p className="loading">Loading orders...</p></div>

    if (orders.length === 0) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <Package size={64} strokeWidth={1} />
                    <h2>No orders yet</h2>
                    <p>Place your first order today!</p>
                    <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Your Orders</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <Link key={order.id} to={`/order-confirmation/${order.id}`} className="order-card">
                        <div className="order-header">
                            <span className="order-number">Order #{order.id}</span>
                            <span className={`order-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                        </div>
                        <div className="order-body">
                            <p>{order.items.length} item{order.items.length > 1 ? 's' : ''} • ${order.totalAmount.toFixed(2)}</p>
                            <p className="order-date">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
