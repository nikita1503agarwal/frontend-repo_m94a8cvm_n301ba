import { useEffect, useMemo, useState } from 'react'
import RestaurantCard from './components/RestaurantCard'
import MenuItemCard from './components/MenuItemCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const USER_ID = 'demo-user'

export default function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selected, setSelected] = useState(null)
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      setError('')
      try {
        // ensure DB seeded (idempotent)
        await fetch(`${API}/api/seed`, { method: 'POST' })
        const res = await fetch(`${API}/api/restaurants`)
        const data = await res.json()
        setRestaurants(data)
        if (data?.length) {
          selectRestaurant(data[0])
        }
        const cartRes = await fetch(`${API}/api/cart/${USER_ID}`)
        setCart(await cartRes.json())
      } catch (e) {
        setError('Unable to load data. Make sure backend is running.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const selectRestaurant = async (r) => {
    setSelected(r)
    const res = await fetch(`${API}/api/menu/${r.id}`)
    setMenu(await res.json())
  }

  const addToCart = async (item) => {
    const payload = {
      restaurant_id: selected.id,
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    }
    const res = await fetch(`${API}/api/cart/${USER_ID}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const updated = await res.json()
    setCart(updated)
  }

  const clearCart = async () => {
    const res = await fetch(`${API}/api/cart/${USER_ID}/clear`, { method: 'POST' })
    setCart(await res.json())
  }

  const total = useMemo(() => cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0, [cart])

  const placeOrder = async () => {
    if (!selected || !cart.items?.length) return
    const payload = {
      user_id: USER_ID,
      restaurant_id: selected.id,
      items: cart.items,
      total,
      address: '221B Baker Street, London'
    }
    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    await clearCart()
    alert(`Order placed! id: ${data.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">QuickBite</h1>
          <div className="text-blue-200">Cart: <span className="font-semibold text-white">{cart.items?.length || 0}</span> items • <span className="font-semibold text-white">${total.toFixed(2)}</span></div>
        </header>

        {loading ? (
          <div className="text-center text-blue-200">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-300">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-white text-xl mb-2">Restaurants</h2>
              {restaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} onSelect={selectRestaurant} />
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl">{selected ? selected.name : 'Select a restaurant'}</h2>
                <div className="flex gap-2">
                  <button onClick={clearCart} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 text-sm">Clear Cart</button>
                  <button onClick={placeOrder} disabled={!cart.items?.length} className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800/40 text-white text-sm">Place Order</button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {menu.map(item => (
                  <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
