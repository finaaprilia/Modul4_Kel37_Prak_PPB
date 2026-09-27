import { useRef } from 'react'

function GunCard({ gun, isFavorite, onToggleFavorite, onAddToCart }) {
  const popup = useRef(null)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onToggleFavorite(gun.id)
  }

  const handleAddToCartClick = (e) => {
    e.stopPropagation()
    onAddToCart(gun)
  }

  const handleImgError = (e) => {
    e.target.onerror = null
    e.target.src = '/guns/pistol.svg'
  }

  return (
    <li className="card">
      <div className="card-inner">
        <button
          type="button"
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Favorited' : 'Add to Favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <button className="card-btn" onClick={() => popup.current.showModal()}>
          <div className="card-img-wrapper">
            <img 
              className="card-img" 
              src={gun.image} 
              alt={gun.name} 
              loading="lazy"
              onError={handleImgError}
            />
          </div>
          <div className="card-details">
            <span className="name display">{gun.name}</span>
            <span className="type">
              {gun.type} · {gun.caliber}
            </span>
            <span className="price">${gun.price.toLocaleString()}</span>
          </div>
        </button>

        <button
          type="button"
          className="add-cart-btn"
          onClick={handleAddToCartClick}
        >
          + Add to Cart
        </button>
      </div>

      <dialog
        className="popup"
        ref={popup}
        onClick={(e) => e.target === popup.current && popup.current.close()}
      >
        <div className="popup-top">
          <button
            type="button"
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? '★ Favorited' : '☆ Favorite'}
          </button>
        </div>

        <div className="popup-img-wrapper">
          <img 
            className="popup-img" 
            src={gun.image} 
            alt={gun.name} 
            onError={handleImgError}
          />
        </div>
        <h3 className="display">{gun.name}</h3>
        <p className="type">
          {gun.type} · {gun.caliber} · <span className="price">${gun.price.toLocaleString()}</span>
        </p>
        <p>{gun.description}</p>
        <form method="dialog" className="popup-actions">
          <button
            type="button"
            className="add-cart-btn"
            onClick={(e) => {
              handleAddToCartClick(e)
              popup.current.close()
            }}
          >
            + Add to Cart
          </button>
          <button className="popup-close">Close</button>
        </form>
      </dialog>
    </li>
  )
}

export default GunCard
