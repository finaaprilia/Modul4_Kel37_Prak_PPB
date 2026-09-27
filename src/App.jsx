import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Catalog from './pages/Catalog.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CartModal from './components/CartModal.jsx'
import './App.css'

function App() {
  const [tab, setTab] = useState('Catalog')
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Toggle Favorite
  const handleToggleFavorite = (gunId) => {
    setFavorites((prev) =>
      prev.includes(gunId) ? prev.filter((id) => id !== gunId) : [...prev, gunId]
    )
  }

  // Add item to Cart
  const handleAddToCart = (gun) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.gun.id === gun.id)
      if (existing) {
        return prevCart.map((item) =>
          item.gun.id === gun.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { gun, quantity: 1 }]
    })
  }

  // Update item quantity in Cart
  const handleUpdateQuantity = (gunId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.gun.id === gunId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  // Remove single item from Cart
  const handleRemoveItem = (gunId) => {
    setCart((prevCart) => prevCart.filter((item) => item.gun.id !== gunId))
  }

  // Clear all items in Cart
  const handleClearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="shell">
      <Header
        tab={tab}
        onTab={setTab}
        cartCount={cartCount}
        favoriteCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="main">
        {tab === 'Catalog' && (
          <Catalog
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        )}
        {tab === 'About' && <About />}
        {tab === 'Contact' && <Contact />}
      </main>

      <Footer />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  )
}

export default App
