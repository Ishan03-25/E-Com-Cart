import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api'

type Product = { _id: string; name: string; price: number }
type CartItem = { id: string; product: Product; qty: number; line: number }

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number }>({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE + '/cart')
      setCart(res.data)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  async function updateQty(item: CartItem) {
    const q = Number(prompt('Quantity', String(item.qty)))
    if (!Number.isFinite(q) || q < 1) return
    await axios.post(API_BASE + '/cart', { productId: item.product._id, qty: q })
    await refresh()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  async function removeItem(id: string) {
    if (!confirm('Remove?')) return
    await axios.delete(API_BASE + '/cart/' + id)
    await refresh()
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const fd = new FormData(form)
    const name = String(fd.get('name') || '')
    const email = String(fd.get('email') || '')
    if (!name || !email) { alert('Name/email required'); return }

    try {
      const res = await axios.post(API_BASE + '/checkout', { name, email })
      // notify other UI pieces
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      navigate('/receipt', { state: { receipt: res.data.receipt } })
    } catch (err) {
      console.error(err)
      alert('Checkout failed')
    }
  }

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Your Cart</h3>
      {loading ? <div>Loading…</div> : (
        <div>
          {cart.items.length === 0 && <div className="muted">Cart is empty</div>}

          <div className="space-y-3">
            {cart.items.map(it => (
              <div className="card flex items-center justify-between" key={it.id}>
                <div>
                  <div className="name font-semibold">{it.product.name}</div>
                  <div className="small">${it.product.price.toFixed(2)} × {it.qty} = ${it.line.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(it)} className="btn secondary">Qty</button>
                  <button onClick={() => removeItem(it.id)} className="btn secondary">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
            <div className="card">
              <div className="text-lg font-semibold">Order summary</div>
              <div className="mt-2">Total: <span className="font-bold text-xl">${cart.total.toFixed(2)}</span></div>
            </div>

            <div className="card">
              <form onSubmit={checkout} className="grid gap-2">
                <input name="name" placeholder="Name" className="border p-2 rounded" />
                <input name="email" placeholder="Email" className="border p-2 rounded" />
                <button className="btn mt-2" type="submit">Checkout</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
