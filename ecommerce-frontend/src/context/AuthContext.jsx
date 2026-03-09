import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('amazon_user')
        if (stored) {
            setUser(JSON.parse(stored))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:8080/api/auth/login', { email, password })
        const userData = res.data
        setUser(userData)
        localStorage.setItem('amazon_user', JSON.stringify(userData))
        return userData
    }

    const register = async (name, email, password) => {
        const res = await axios.post('http://localhost:8080/api/auth/register', { name, email, password })
        return res.data
    }

    const updateProfile = async (updates) => {
        const res = await axios.put(`http://localhost:8080/api/auth/user/${user.id}`, updates)
        const updatedUser = res.data
        setUser(updatedUser)
        localStorage.setItem('amazon_user', JSON.stringify(updatedUser))
        return updatedUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('amazon_user')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
