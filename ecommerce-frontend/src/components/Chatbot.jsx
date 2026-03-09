import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, ChevronDown, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Sound effects using Web Audio API (no external files needed)
const audioCtx = () => new (window.AudioContext || window.webkitAudioContext)()

function playSendSound() {
    try {
        const ctx = audioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(660, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)
        gain.gain.setValueAtTime(0.12, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.12)
    } catch (e) { /* audio not supported */ }
}

function playReceiveSound() {
    try {
        const ctx = audioCtx()
        // Two-tone chime
        const notes = [523.25, 659.25] // C5, E5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1)
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2)
            osc.start(ctx.currentTime + i * 0.1)
            osc.stop(ctx.currentTime + i * 0.1 + 0.2)
        })
    } catch (e) { /* audio not supported */ }
}

function playOpenSound() {
    try {
        const ctx = audioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
    } catch (e) { /* audio not supported */ }
}

// Smart FAQ response engine
const FAQ_DATABASE = [
    {
        keywords: ['track', 'order', 'where', 'shipping', 'delivery', 'status', 'shipped'],
        answer: "You can track your orders by going to **Your Orders** page. Click your profile icon → Your Orders, or navigate to the Orders page from the navbar. Each order shows its current status and estimated delivery date.",
        followUp: ['How long does delivery take?', 'Can I change my delivery address?']
    },
    {
        keywords: ['return', 'refund', 'exchange', 'money back', 'damaged', 'wrong item'],
        answer: "We have a **30-day return policy** for most items. To initiate a return:\n1. Go to Your Orders\n2. Select the item\n3. Click 'Return or Replace'\n4. Choose your reason\n\nRefunds are processed within 5-7 business days after we receive the item.",
        followUp: ['What items cannot be returned?', 'How long does refund take?']
    },
    {
        keywords: ['payment', 'pay', 'card', 'upi', 'wallet', 'emi', 'cod', 'cash'],
        answer: "We accept multiple payment methods:\n• **Credit/Debit Cards** (Visa, Mastercard, RuPay)\n• **UPI** (Google Pay, PhonePe, Paytm)\n• **Net Banking**\n• **Amazon Pay Wallet**\n• **EMI** on select cards\n• **Cash on Delivery** (COD)",
        followUp: ['Is COD available for all items?', 'How to add a payment method?']
    },
    {
        keywords: ['account', 'profile', 'password', 'email', 'update', 'change', 'edit'],
        answer: "To manage your account:\n1. Click your **profile avatar** in the navbar\n2. Go to **Your Account** page\n3. Click **Edit Profile** to update your name, phone, address, etc.\n\nYour email address is set during registration and linked to your account.",
        followUp: ['How to change my password?', 'How to delete my account?']
    },
    {
        keywords: ['sell', 'seller', 'list', 'product', 'vendor', 'merchant', 'become seller'],
        answer: "Want to sell on Amazon? It's easy!\n1. **Sign up** for an account (or log in)\n2. Click the **Sell** button in the navbar\n3. Go to your **Seller Dashboard**\n4. Click **Add New Product** and fill in the details\n\nYour products will appear on the homepage for millions of customers! 🚀",
        followUp: ['How much commission does Amazon charge?', 'How to add product images?']
    },
    {
        keywords: ['cancel', 'order cancel'],
        answer: "To cancel an order:\n1. Go to **Your Orders**\n2. Select the order you want to cancel\n3. Click **Cancel Order**\n\n⚠️ Orders can only be cancelled before they're shipped. Once shipped, you'll need to return the item after delivery.",
        followUp: ['Will I get a full refund?', 'How to track my return?']
    },
    {
        keywords: ['contact', 'support', 'help', 'customer service', 'phone', 'email support'],
        answer: "You can reach our customer support through:\n• **This chat** — I'm here 24/7! 🤖\n• **Email**: support@amazon.com\n• **Phone**: 1-800-AMAZON (available 9 AM - 9 PM)\n• **Help Center**: Visit our FAQ section\n\nI'll do my best to resolve your query right here!",
        followUp: ['I need to talk to a human agent', 'What are your support hours?']
    },
    {
        keywords: ['discount', 'coupon', 'offer', 'sale', 'deal', 'promo', 'code'],
        answer: "Here's how to find the best deals:\n• Check our **Deals of the Day** on the homepage\n• Look for the 🏷️ coupon badge on product pages\n• Subscribe to our newsletter for exclusive codes\n• Use **Amazon Pay** for additional cashback\n\n💡 Pro tip: Add items to your cart and we'll notify you when prices drop!",
        followUp: ['How to apply a coupon code?', 'When is the next big sale?']
    },
    {
        keywords: ['prime', 'membership', 'premium', 'subscription', 'free delivery'],
        answer: "**Amazon Prime** benefits include:\n• ✅ FREE same-day & next-day delivery\n• 🎬 Prime Video streaming\n• 🎵 Prime Music\n• 📖 Prime Reading\n• 🏷️ Exclusive deals & early access to sales\n\nPrime membership starts at just ₹1499/year!",
        followUp: ['How to start a free trial?', 'Can I share Prime with family?']
    },
    {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'sup', 'yo'],
        answer: "Hey there! 👋 Welcome to Amazon support! I'm your virtual assistant and I'm here to help.\n\nYou can ask me about:\n• 📦 Order tracking & delivery\n• 🔄 Returns & refunds\n• 💳 Payment methods\n• 👤 Account management\n• 🏪 Selling on Amazon\n\nWhat can I help you with today?",
        followUp: ['Track my order', 'Return policy', 'Payment options']
    },
    {
        keywords: ['thank', 'thanks', 'bye', 'goodbye', 'okay', 'got it', 'helpful'],
        answer: "You're welcome! 😊 Glad I could help. If you have any more questions, feel free to ask anytime. Happy shopping! 🛍️",
        followUp: []
    }
]

function getBotResponse(message) {
    const lower = message.toLowerCase().trim()

    // Find best matching FAQ
    let bestMatch = null
    let bestScore = 0

    for (const faq of FAQ_DATABASE) {
        let score = 0
        for (const keyword of faq.keywords) {
            if (lower.includes(keyword)) {
                score += keyword.length // longer keyword matches score higher
            }
        }
        if (score > bestScore) {
            bestScore = score
            bestMatch = faq
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch
    }

    // Default response
    return {
        answer: "I'm not sure about that one, but I'm here to help! 🤔\n\nYou can ask me about:\n• Order tracking & shipping\n• Returns & refunds\n• Payment methods\n• Account settings\n• Selling on Amazon\n\nOr try clicking one of the quick replies below!",
        followUp: ['Track my order', 'Return policy', 'Payment options', 'Contact support']
    }
}

// Typing indicator animation
function TypingIndicator() {
    return (
        <div className="chat-message bot">
            <div className="chat-avatar bot-avatar"><Bot size={16} /></div>
            <div className="chat-bubble bot-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
        </div>
    )
}

export default function Chatbot() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [hasGreeted, setHasGreeted] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleOpen = () => {
        setIsOpen(true)
        playOpenSound()
        if (!hasGreeted) {
            setHasGreeted(true)
            const name = user?.name?.split(' ')[0] || 'there'
            setTimeout(() => {
                setMessages([{
                    type: 'bot',
                    text: `Hi ${name}! 👋 I'm Amazon's virtual assistant. How can I help you today?`,
                    followUp: ['Track my order', 'Return an item', 'Payment help', 'Become a seller']
                }])
            }, 400)
        }
    }

    const sendMessage = async (text) => {
        if (!text.trim()) return

        // Add user message
        const userMsg = { type: 'user', text: text.trim() }
        setMessages(prev => [...prev, userMsg])
        playSendSound()
        setInput('')

        // Simulate typing delay
        setIsTyping(true)
        const delay = Math.min(500 + text.length * 20, 1500)

        setTimeout(() => {
            const response = getBotResponse(text)
            const botMsg = {
                type: 'bot',
                text: response.answer,
                followUp: response.followUp || []
            }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
            playReceiveSound()
        }, delay)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(input)
    }

    const handleQuickReply = (text) => {
        sendMessage(text)
    }

    // Simple markdown-like rendering for bold
    const renderText = (text) => {
        return text.split('\n').map((line, i) => (
            <span key={i}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>
                    }
                    return part
                })}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ))
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`chatbot-fab ${isOpen ? 'hidden' : ''}`}
                onClick={handleOpen}
                title="Chat with us"
            >
                <Sparkles size={14} className="fab-sparkle" />
                <MessageCircle size={24} />
                <span className="fab-pulse"></span>
            </button>

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-header-avatar">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3>Amazon Support</h3>
                            <span className="chatbot-status">
                                <span className="status-dot"></span> Online — Typically replies instantly
                            </span>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="chatbot-messages">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            <div className={`chat-message ${msg.type}`}>
                                {msg.type === 'bot' && (
                                    <div className="chat-avatar bot-avatar"><Bot size={16} /></div>
                                )}
                                <div className={`chat-bubble ${msg.type}-bubble`}>
                                    {renderText(msg.text)}
                                </div>
                                {msg.type === 'user' && (
                                    <div className="chat-avatar user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                                    </div>
                                )}
                            </div>
                            {/* Quick Reply Suggestions */}
                            {msg.type === 'bot' && msg.followUp?.length > 0 && i === messages.length - 1 && (
                                <div className="quick-replies">
                                    {msg.followUp.map((text, j) => (
                                        <button key={j} className="quick-reply-btn" onClick={() => handleQuickReply(text)}>
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="chatbot-input" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" disabled={!input.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </>
    )
}
