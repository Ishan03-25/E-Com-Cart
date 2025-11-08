
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductsPage from './pages/ProductsPage'
import CartPage from "./pages/CartPage"
import ReceiptPage from './pages/ReceiptPage'
import axios from 'axios'
import './App.css'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api'

function NavBar() {
  const [count, setCount] = useState(0)

  async function fetchCount() {
    try {
      const res = await axios.get(API_BASE + '/cart')
  const items = (res.data.items || []) as Array<{ qty?: number }>
  const qty = items.reduce((s: number, it) => s + (it.qty || 0), 0)
      setCount(qty)
    } catch (err: unknown) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCount()
    const onUpdate = () => fetchCount()
    window.addEventListener('cartUpdated', onUpdate as EventListener)
    return () => window.removeEventListener('cartUpdated', onUpdate as EventListener)
  }, [])


  const CartIcon = () => (
    <div className="inline-flex items-center">
      <Link to="/cart" title="View cart" aria-label="View cart" className="relative inline-flex items-center justify-center w-12 h-12 rounded-md text-gray-700 hover:text-gray-900 bg-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img">
          <title>Cart</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center">{count}</span>
        )}
      </Link>
    </div>
  )

  return (
    <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="max-w-[1100px] mx-auto px-3 flex flex-row items-center justify-between h-16">
        <div className="flex flex-row items-center gap-3 flex-nowrap">
          <Link to="/" className="flex flex-row items-center gap-3 whitespace-nowrap">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">V</div>
            <div>
              <div className="text-lg font-bold">Vibe Commerce</div>
              <div className="text-xs text-gray-500">Handcrafted demo store</div>
            </div>
          </Link>
        </div>

        <div className="flex flex-row items-center gap-6 flex-nowrap">
          <NavLink
            to="/"
            className={({ isActive }) => `whitespace-nowrap ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Products
          </NavLink>
          <CartIcon />
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <main className="container pt-28 pb-10">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
        </Routes>
      </main>
    </div>
  )
}
