import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Truck, ShieldCheck, CreditCard, Headphones, ArrowRight, Zap, Gift, Globe } from 'lucide-react'
import axios from 'axios'
import ProductCard from './ProductCard'
import { API_BASE_URL } from '../config/api'

export default function HomePage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/products/categories`)
            .then(res => setCategories(res.data))
            .catch(() => { })
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategory) params.append('category', selectedCategory)

        axios.get(`${API_BASE_URL}/api/products?${params.toString()}`)
            .then(res => { setProducts(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [searchQuery, selectedCategory])

    const showFullPage = !searchQuery && !selectedCategory

    return (
        <>
            {/* ===== HERO SECTION ===== */}
            {showFullPage && (
                <section className="hero">
                    <div className="hero-bg-elements">
                        <div className="hero-orb orb-1"></div>
                        <div className="hero-orb orb-2"></div>
                        <div className="hero-orb orb-3"></div>
                        <div className="hero-grid-lines"></div>
                    </div>
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Zap size={14} />
                            <span>New Season Arrivals</span>
                        </div>
                        <h1 className="hero-title">
                            Discover Your
                            <span className="hero-gradient"> Perfect Style</span>
                        </h1>
                        <p className="hero-subtitle">
                            Explore thousands of premium products from top brands.
                            Fast delivery, secure payments, and unmatched quality — all in one place.
                        </p>
                        <div className="hero-actions">
                            <a href="#products" className="hero-btn primary">
                                Shop Now <ArrowRight size={18} />
                            </a>
                            <Link to="/seller" className="hero-btn secondary">
                                Start Selling
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-value">50K+</span>
                                <span className="hero-stat-label">Products</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">10M+</span>
                                <span className="hero-stat-label">Happy Customers</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">99.9%</span>
                                <span className="hero-stat-label">Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== TRUST BADGES ===== */}
            {showFullPage && (
                <section className="trust-bar">
                    <div className="trust-item">
                        <Truck size={22} />
                        <div>
                            <strong>Free Shipping</strong>
                            <span>On orders over $50</span>
                        </div>
                    </div>
                    <div className="trust-item">
                        <ShieldCheck size={22} />
                        <div>
                            <strong>Secure Checkout</strong>
                            <span>100% protected</span>
                        </div>
                    </div>
                    <div className="trust-item">
                        <CreditCard size={22} />
                        <div>
                            <strong>Easy Returns</strong>
                            <span>30-day free returns</span>
                        </div>
                    </div>
                    <div className="trust-item">
                        <Headphones size={22} />
                        <div>
                            <strong>24/7 Support</strong>
                            <span>We're here to help</span>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== PRODUCTS SECTION ===== */}
            <div className="page-container" id="products">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            {searchQuery ? `Results for "${searchQuery}"` :
                                selectedCategory ? `Category: ${selectedCategory}` : 'Trending Products'}
                        </h2>
                        <p className="section-desc">
                            {showFullPage && 'Hand-picked selections curated just for you'}
                        </p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="category-bar">
                    <button className={`category-chip ${selectedCategory === '' ? 'active' : ''}`} onClick={() => setSelectedCategory('')}>
                        All
                    </button>
                    {categories.map(cat => (
                        <button key={cat} className={`category-chip ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="loading">Loading products...</p>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <h2>No products found</h2>
                        <p>Try adjusting your search or filter.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* ===== FEATURES SECTION ===== */}
            {showFullPage && (
                <section className="features-section">
                    <div className="page-container">
                        <div className="section-header centered">
                            <h2 className="section-title">Why Shop With Us?</h2>
                            <p className="section-desc">We go above and beyond to deliver exceptional experiences</p>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon" style={{ background: 'rgba(255,153,0,0.1)' }}>
                                    <Zap size={28} color="#ff9900" />
                                </div>
                                <h3>Lightning Fast Delivery</h3>
                                <p>Get your orders delivered within 24 hours with our express shipping. Free for Prime members.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon" style={{ background: 'rgba(74,222,128,0.1)' }}>
                                    <ShieldCheck size={28} color="#4ade80" />
                                </div>
                                <h3>Buyer Protection</h3>
                                <p>Every purchase is protected with our money-back guarantee. Shop with complete confidence.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon" style={{ background: 'rgba(96,165,250,0.1)' }}>
                                    <Gift size={28} color="#60a5fa" />
                                </div>
                                <h3>Exclusive Deals</h3>
                                <p>Unlock members-only discounts, early access to sales, and personalized recommendations.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon" style={{ background: 'rgba(251,146,60,0.1)' }}>
                                    <Globe size={28} color="#fb923c" />
                                </div>
                                <h3>Global Marketplace</h3>
                                <p>Access millions of products from sellers worldwide. Discover unique items you won't find anywhere else.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== ABOUT SECTION ===== */}
            {showFullPage && (
                <section className="about-section">
                    <div className="page-container">
                        <div className="about-grid">
                            <div className="about-content">
                                <span className="about-label">About Amazon</span>
                                <h2 className="about-title">
                                    Redefining Online Shopping
                                    <span className="about-highlight"> Since 1994</span>
                                </h2>
                                <p className="about-text">
                                    From a small online bookstore to the world's largest marketplace, Amazon has been on
                                    a mission to be Earth's most customer-centric company. We believe in innovation,
                                    convenience, and delivering smiles to millions of doorsteps every day.
                                </p>
                                <p className="about-text">
                                    Our platform connects millions of sellers with billions of customers worldwide,
                                    offering everything from everyday essentials to luxury goods — all backed by
                                    world-class logistics and unmatched customer support.
                                </p>
                                <div className="about-stats">
                                    <div className="about-stat">
                                        <span className="about-stat-num">300M+</span>
                                        <span className="about-stat-text">Active Customers</span>
                                    </div>
                                    <div className="about-stat">
                                        <span className="about-stat-num">12M+</span>
                                        <span className="about-stat-text">Products Listed</span>
                                    </div>
                                    <div className="about-stat">
                                        <span className="about-stat-num">190+</span>
                                        <span className="about-stat-text">Countries Served</span>
                                    </div>
                                </div>
                            </div>
                            <div className="about-visual">
                                <div className="about-card-stack">
                                    <div className="about-card ac-1">🚀 Innovation</div>
                                    <div className="about-card ac-2">💬 Customer First</div>
                                    <div className="about-card ac-3">🌍 Global Reach</div>
                                    <div className="about-card ac-4">⚡ Speed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== FOOTER ===== */}
            {showFullPage && (
                <footer className="site-footer">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h2 className="footer-logo">amazon</h2>
                            <p>Earth's most customer-centric company. Delivering smiles since 1994.</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-col">
                                <h4>Shop</h4>
                                <a href="#products">All Products</a>
                                <a href="#products">Electronics</a>
                                <a href="#products">Fashion</a>
                                <a href="#products">Home</a>
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="#about">About Us</a>
                                <a href="#">Careers</a>
                                <a href="#">Press</a>
                                <a href="#">Blog</a>
                            </div>
                            <div className="footer-col">
                                <h4>Support</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Contact Us</a>
                                <a href="#">Returns</a>
                                <a href="#">Shipping Info</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Amazon Clone. Built with ❤️ for learning.</p>
                    </div>
                </footer>
            )}
        </>
    )
}
