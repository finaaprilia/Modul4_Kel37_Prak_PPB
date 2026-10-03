import { useState, useMemo } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'

function Catalog({ favorites, onToggleFavorite, onAddToCart }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortField, setSortField] = useState('default') // 'default' | 'name' | 'price'
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' | 'desc'
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'favorites'

  // Extract unique gun types for the filter dropdown
  const gunTypes = useMemo(() => {
    const types = Array.from(new Set(GUNS.map((g) => g.type)))
    return ['all', ...types]
  }, [])

  // Toggle sort by Name
  const handleToggleSortName = () => {
    if (sortField !== 'name') {
      setSortField('name')
      setSortDirection('asc')
    } else {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    }
  }

  // Toggle sort by Price
  const handleToggleSortPrice = () => {
    if (sortField !== 'price') {
      setSortField('price')
      setSortDirection('asc')
    } else {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    }
  }

  // Reset sort
  const handleResetSort = () => {
    setSortField('default')
    setSortDirection('asc')
  }

  // Reset all filters
  const handleResetAllFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setFilterTab('all')
    setSortField('default')
    setSortDirection('asc')
  }

  const filteredAndSortedGuns = useMemo(() => {
    let result = [...GUNS]

    // 1. Filter by Favorites Tab
    if (filterTab === 'favorites') {
      result = result.filter((gun) => favorites.includes(gun.id))
    }

    // 2. Filter by Product Type (Jenis Produk)
    if (selectedType !== 'all') {
      result = result.filter(
        (gun) => gun.type.toLowerCase() === selectedType.toLowerCase()
      )
    }

    // 3. Filter by Search Query (Nama Produk)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((gun) =>
        gun.name.toLowerCase().includes(q)
      )
    }

    // 4. Sorting by Name or Price with direction toggle
    if (sortField === 'name') {
      result.sort((a, b) => {
        const cmp = a.name.localeCompare(b.name)
        return sortDirection === 'asc' ? cmp : -cmp
      })
    } else if (sortField === 'price') {
      result.sort((a, b) => {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price
      })
    }

    return result
  }, [searchQuery, selectedType, filterTab, favorites, sortField, sortDirection])

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
          {/* Top Controls: Search by Name & Filter by Type */}
          <div className="controls-row primary-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari nama produk / Search by product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Cari nama produk"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="filter-type-box">
              <label htmlFor="type-filter" className="control-label">
                Jenis Produk:
              </label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
                aria-label="Filter jenis produk"
              >
                <option value="all">Semua Jenis ({GUNS.length})</option>
                {gunTypes
                  .filter((t) => t !== 'all')
                  .map((type) => {
                    const count = GUNS.filter((g) => g.type === type).length
                    return (
                      <option key={type} value={type}>
                        {type} ({count})
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>

          {/* Bottom Controls: All/Favorites tabs & Toggle Sort buttons */}
          <div className="controls-row secondary-controls">
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

            <div className="sort-toggle-group">
              <span className="sort-label">Urutkan:</span>
              <button
                type="button"
                className={`sort-toggle-btn ${sortField === 'name' ? 'active' : ''}`}
                onClick={handleToggleSortName}
                title="Klik untuk mengurutkan berdasarkan nama (A-Z / Z-A)"
              >
                Nama {sortField === 'name' ? (sortDirection === 'asc' ? '▲ (A-Z)' : '▼ (Z-A)') : '↕'}
              </button>
              <button
                type="button"
                className={`sort-toggle-btn ${sortField === 'price' ? 'active' : ''}`}
                onClick={handleToggleSortPrice}
                title="Klik untuk mengurutkan berdasarkan harga (Termurah / Termahal)"
              >
                Harga {sortField === 'price' ? (sortDirection === 'asc' ? '▲ ($ Rendah)' : '▼ ($ Tinggi)') : '↕'}
              </button>
              {sortField !== 'default' && (
                <button
                  type="button"
                  className="sort-reset-btn"
                  onClick={handleResetSort}
                  title="Kembalikan urutan default"
                >
                  Reset Sort
                </button>
              )}
            </div>
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
                : 'Tidak ada produk yang cocok dengan pencarian atau filter.'}
            </p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={handleResetAllFilters}
            >
              Reset Filter &amp; Pencarian
            </button>
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

