import { HashRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Payment from './components/Payment'
import OrderConfirmation from './components/OrderConfirmation'
import Orders from './components/Orders'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import SellerDashboard from './components/SellerDashboard'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'
import Chatbot from './components/Chatbot'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/add-product" element={<AddProduct />} />
              <Route path="/seller/edit-product/:id" element={<EditProduct />} />
            </Routes>
            <Chatbot />
          </div>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
