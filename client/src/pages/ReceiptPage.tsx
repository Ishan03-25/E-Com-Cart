import { useLocation, Link } from 'react-router-dom'

export default function ReceiptPage() {
  const { state } = useLocation()
  const receipt = (state as unknown as { receipt?: { items: Array<{ product?: { name: string } | string; qty: number; price: number }>; total: number; name: string; email: string; createdAt: string } })?.receipt

  if (!receipt) return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold">No receipt</h3>
      <div className="mt-3"><Link to="/" className="text-blue-600">Back to products</Link></div>
    </div>
  )

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-3xl font-bold">Thank you — Order received</h3>
        <div className="text-sm text-gray-600">{new Date(receipt.createdAt).toLocaleString()}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="font-semibold">Customer</div>
          <div className="mt-2">{receipt.name} — <span className="text-sm text-gray-500">{receipt.email}</span></div>
        </div>

        <div className="card">
          <div className="font-semibold">Summary</div>
          <div className="mt-2">
            {receipt.items.map((it, idx: number) => {
              const pname = typeof it.product === 'string' ? it.product : (it.product?.name || 'Product')
              return (
                <div key={idx} className="receipt-item flex justify-between py-1">
                  <div>{pname} × {it.qty}</div>
                  <div>${(it.price * it.qty).toFixed(2)}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 font-bold">Total: ${receipt.total.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6"><Link to="/" className="text-blue-600">Back to products</Link></div>
    </div>
  )
}
