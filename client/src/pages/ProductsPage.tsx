import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api'

type Product = { _id: string; name: string; price: number; description?: string; image?: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    try {
      const res = await axios.get(API_BASE + '/products')
      setProducts(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function addToCart(id: string) {
    try {
      await axios.post(API_BASE + '/cart', { productId: id, qty: 1 })
      // notify navbar and other pages
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      // small inline feedback
      const el = document.createElement('div')
      el.textContent = 'Added to cart'
      el.className = 'fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1800)
    } catch (err) {
      console.error(err)
      alert('Add failed')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-3xl font-bold">Products</h3>
          <p className="text-gray-500">Browse our selection of demo items</p>
        </div>
      </div>

      <div className="grid">
        {products.map(p => (
          <div key={p._id} className="card flex flex-col">
            <div className="h-40 bg-gray-50 rounded-md mb-3 flex items-center justify-center overflow-hidden">
              <img src={p.image || `https://picsum.photos/seed/${p._id}/400/300`} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{p.name}</h4>
              <div className="price text-indigo-600 mt-1">${p.price.toFixed(2)}</div>
              <p className="desc text-sm text-gray-600 mt-2 overflow-hidden">{p.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button className="btn" onClick={() => addToCart(p._id)}>Add to cart</button>
              <Link to="/cart" className="text-sm text-gray-500">View cart →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
