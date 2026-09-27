import { useState, useMemo } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'

function Catalog({ favorites, onToggleFavorite, onAddToCart }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'favorites'

  const filteredAndSortedGuns = useMemo(() => {
    let result = [...GUNS]

    // 1. Filter by Favorites
    if (filterTab === 'favorites') {
      result = result.filter((gun) => favorites.includes(gun.id))
    }

    // 2. Filter by Live Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (gun) =>
          gun.name.toLowerCase().includes(q) ||
          gun.type.toLowerCase().includes(q) ||
          gun.caliber.toLowerCase().includes(q)
      )
    }

    // 3. Sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    return result
  }, [searchQuery, sortBy, filterTab, favorites])

  return (
    <>
      <section className="masthead">
        <h1 className="display">Hardware, by the spec sheet.</h1>
        <p className="lede">
          A small armory of pistols, rifles, and shotguns. Every piece listed with its
          type, caliber, and price — nothing else.
        </p>
      </section>

      <section>
        <div className="controls-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, type, caliber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          <div className="controls-right">
            <div className="filter-tabs">
              <button
                type="button"
                className={filterTab === 'all' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setFilterTab('all')}
              >
                All ({GUNS.length})
              </button>
              <button
                type="button"
                className={filterTab === 'favorites' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setFilterTab('favorites')}
              >
                ★ Favorites ({favorites.length})
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sort by: Default</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="list-head">
          <h2>
            {filterTab === 'favorites' ? 'Favorite Items' : 'Current stock'}
          </h2>
          <span className="count">{filteredAndSortedGuns.length} pieces found</span>
        </div>

        {filteredAndSortedGuns.length === 0 ? (
          <div className="no-results">
            <p className="no-results-text">
              {filterTab === 'favorites' && favorites.length === 0 && searchQuery === ''
                ? 'No favorite items added yet. Click the star icon on any card to favorite it!'
                : 'no guns match'}
            </p>
          </div>
        ) : (
          <ul className="stock">
            {filteredAndSortedGuns.map((gun) => (
              <GunCard
                key={gun.id}
                gun={gun}
                isFavorite={favorites.includes(gun.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Catalog
