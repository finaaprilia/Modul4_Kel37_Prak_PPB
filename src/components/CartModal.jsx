import { useState } from 'react'

function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [step, setStep] = useState('cart') // 'cart' | 'checkout' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'credit-card',
    notes: '',
  })
  const [orderDetails, setOrderDetails] = useState(null)

  if (!isOpen) return null

  const totalPrice = cart.reduce((sum, item) => sum + item.gun.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleClose = () => {
    setStep('cart')
    onClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return
    setStep('checkout')
  }

  const handleCompleteCheckout = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill in all required shipping fields.')
      return
    }

    const orderId = 'GS-' + Math.floor(100000 + Math.random() * 900000)
    setOrderDetails({
      id: orderId,
      items: [...cart],
      total: totalPrice,
      customer: { ...formData },
      date: new Date().toLocaleString(),
    })
    setStep('success')
    onClearCart()
  }

  const handleFinish = () => {
    setStep('cart')
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: 'credit-card',
      notes: '',
    })
    setOrderDetails(null)
    onClose()
  }

  const handleImgError = (e) => {
    e.target.onerror = null
    e.target.src = '/guns/pistol.svg'
  }

  return (
    <div className="cart-backdrop" onClick={handleClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Step 1: Cart View */}
        {step === 'cart' && (
          <>
            <div className="cart-header">
              <h2 className="display">Shopping Cart ({totalItems})</h2>
              <button type="button" className="cart-close-btn" onClick={handleClose}>
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map(({ gun, quantity }) => (
                    <li key={gun.id} className="cart-item">
                      <img
                        src={gun.image}
                        alt={gun.name}
                        className="cart-item-img"
                        onError={handleImgError}
                      />
                      <div className="cart-item-info">
                        <h4 className="name">{gun.name}</h4>
                        <p className="type">
                          {gun.type} · ${gun.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="cart-qty-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(gun.id, -1)}
                          aria-label={`Kurangi kuantitas ${gun.name}`}
                          title="Kurangi kuantitas (-1)"
                        >
                          -
                        </button>
                        <span className="qty-val" aria-label={`Kuantitas: ${quantity}`}>{quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(gun.id, 1)}
                          aria-label={`Tambah kuantitas ${gun.name}`}
                          title="Tambah kuantitas (+1)"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-subtotal" title="Subtotal">
                        ${(gun.price * quantity).toLocaleString()}
                      </div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => onRemoveItem(gun.id)}
                        title={`Hapus ${gun.name} dari keranjang`}
                        aria-label={`Hapus ${gun.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total Harga ({totalItems} item):</span>
                    <span className="total-price">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="cart-actions">
                    <button type="button" className="cart-clear-btn" onClick={onClearCart}>
                      Clear Cart
                    </button>
                    <button
                      type="button"
                      className="cart-checkout-btn"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout &rarr;
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Step 2: Checkout Form View */}
        {step === 'checkout' && (
          <form onSubmit={handleCompleteCheckout} className="checkout-form">
            <div className="cart-header">
              <h2 className="display">Checkout Information</h2>
              <button type="button" className="cart-close-btn" onClick={handleClose}>
                &times;
              </button>
            </div>

            <div className="checkout-body">
              <div className="checkout-summary-mini">
                <span>Order Total ({totalItems} items):</span>
                <strong className="total-price">${totalPrice.toLocaleString()}</strong>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+1 555-0199"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Shipping Address *</label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows="2"
                  placeholder="Street address, City, State, Postal Code"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="credit-card">Credit / Debit Card</option>
                  <option value="bank-transfer">Direct Bank Transfer</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  placeholder="Gate code, special instructions..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="cart-footer">
              <div className="cart-actions">
                <button
                  type="button"
                  className="cart-clear-btn"
                  onClick={() => setStep('cart')}
                >
                  &larr; Back to Cart
                </button>
                <button type="submit" className="cart-checkout-btn">
                  Confirm & Pay ${totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Success View */}
        {step === 'success' && orderDetails && (
          <div className="checkout-success">
            <div className="cart-header">
              <h2 className="display">Order Confirmed!</h2>
              <button type="button" className="cart-close-btn" onClick={handleFinish}>
                &times;
              </button>
            </div>

            <div className="success-body">
              <div className="success-badge">✓</div>
              <h3>Thank you for your purchase!</h3>
              <p className="order-number">Order ID: <strong>#{orderDetails.id}</strong></p>
              
              <div className="order-summary-box">
                <div className="summary-row">
                  <span>Customer:</span>
                  <strong>{orderDetails.customer.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Phone:</span>
                  <span>{orderDetails.customer.phone}</span>
                </div>
                <div className="summary-row">
                  <span>Address:</span>
                  <span>{orderDetails.customer.address}</span>
                </div>
                <div className="summary-row">
                  <span>Payment:</span>
                  <span className="capitalize">{orderDetails.customer.paymentMethod.replace('-', ' ')}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-items">
                  <strong>Purchased Items ({orderDetails.items.reduce((s, i) => s + i.quantity, 0)}):</strong>
                  <ul>
                    {orderDetails.items.map(({ gun, quantity }) => (
                      <li key={gun.id}>
                        {gun.name} &times; {quantity} (${(gun.price * quantity).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total Amount Paid:</span>
                  <strong className="total-price">${orderDetails.total.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="cart-footer">
              <button type="button" className="cart-checkout-btn full-width" onClick={handleFinish}>
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartModal
