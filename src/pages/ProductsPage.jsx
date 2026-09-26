import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import ProductGrid from '../components/products/ProductGrid'
import { products } from '../data/products'

export default function ProductsPage() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState(params.get('category') || 'All products')
  const [family, setFamily] = useState('All families')
  const [query, setQuery] = useState(params.get('search') || '')
  const [visible, setVisible] = useState(16)
  const categories = ['All products', 'Water Treatment', 'Solar Water Heaters']

  const families = useMemo(() => [...new Set(products
    .filter((product) => category === 'All products' || product.category === category)
    .map((product) => product.family))].sort(), [category])

  const filtered = useMemo(() => products.filter((product) => {
    const search = query.toLowerCase()
    return (category === 'All products' || product.category === category)
      && (family === 'All families' || product.family === family)
      && (!search || `${product.name} ${product.family} ${product.id}`.toLowerCase().includes(search))
  }), [category, family, query])

  const chooseCategory = (nextCategory) => {
    setCategory(nextCategory)
    setFamily('All families')
    setVisible(16)
  }

  const chooseFamily = (nextFamily) => {
    setFamily(nextFamily)
    setVisible(16)
  }

  return <section className="products-section inner-products products-page-compact" aria-labelledby="catalog-results">
    <div className="products-catalog-layout">
      <aside className="product-filters" aria-label="Filter products">
        <div className="filter-group">
          <h2>Products</h2>
          <div className="tabs" aria-label="Product categories">
            {categories.map((item) =>
              <button className={category === item ? 'active' : ''} aria-pressed={category === item} key={item} onClick={() => chooseCategory(item)}>
                <span>{item}</span>
                <small>{item === 'All products' ? products.length : products.filter((product) => product.category === item).length}</small>
              </button>
            )}
          </div>
        </div>
        <div className="filter-group">
          <h2>Product families</h2>
          <div className="family-row" aria-label="Product families">
            <button className={family === 'All families' ? 'active' : ''} aria-pressed={family === 'All families'} onClick={() => chooseFamily('All families')}>
              <span>All families</span><small>{products.filter((product) => category === 'All products' || product.category === category).length}</small>
            </button>
            {families.map((item) =>
              <button className={family === item ? 'active' : ''} aria-pressed={family === item} key={item} onClick={() => chooseFamily(item)}>
                <span>{item}</span><small>{products.filter((product) => (category === 'All products' || product.category === category) && product.family === item).length}</small>
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="catalog-results">
        <div className="catalog-toolbar">
          <div>
            <span>Product catalogue</span>
            <strong id="catalog-results" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</strong>
          </div>
          <label className="search">
            <span className="sr-only">Search products or item names</span>
            <MdSearch aria-hidden="true"/>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(16) }} placeholder="Search products by name" type="search"/>
          </label>
        </div>
        <ProductGrid products={filtered.slice(0, visible)}/>
        {!filtered.length && <div className="empty-state"><h3>No matching products</h3><p>Try a broader search or another family.</p></div>}
        {visible < filtered.length && <button className="load-more" onClick={() => setVisible((current) => current + 16)}>Show more products <span>{Math.min(16, filtered.length - visible)} more</span></button>}
      </div>
    </div>
  </section>
}
