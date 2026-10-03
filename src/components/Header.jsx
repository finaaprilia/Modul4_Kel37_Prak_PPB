const NAV = ['Catalog', 'About', 'Contact']

function Header({ tab, onTab, cartCount, favoriteCount, onOpenCart }) {
  return (
    <header className="header">
      <span className="brand display">Bore &amp; Barrel</span>
      
      <div className="header-actions">
        <nav className="nav">
          {NAV.map((item) => (
            <button
              key={item}
              type="button"
              className={tab === item ? 'nav-link active' : 'nav-link'}
              onClick={() => onTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="cart-badge-btn"
          onClick={onOpenCart}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Cart</span>
          <span className="badge" title={`${cartCount} items in cart`}>
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
