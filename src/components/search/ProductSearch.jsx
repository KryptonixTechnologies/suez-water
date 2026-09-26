import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import { products } from '../../data/products'
import { getProductImage } from '../../utils/productImages'
import { niceName, productPath } from '../../utils/products'

const normalize = (value) => value
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/gi, ' ')
  .trim()
  .toLowerCase()

const editDistance = (left, right) => {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0]
    row[0] = leftIndex
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previous = row[rightIndex]
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      )
      diagonal = previous
    }
  }
  return row[right.length]
}

const rankProduct = (product, query) => {
  const name = normalize(product.name)
  const compactName = name.replaceAll(' ', '')
  const compactQuery = query.replaceAll(' ', '')
  if (name === query) return 0
  if (name.startsWith(query)) return 1
  if (name.includes(query)) return 2 + name.indexOf(query) / 100

  const queryWords = query.split(' ')
  const nameWords = name.split(' ')
  const matchingWords = queryWords.filter((word) => nameWords.some((nameWord) => nameWord.startsWith(word))).length
  const distance = editDistance(compactQuery, compactName.slice(0, Math.max(compactQuery.length, Math.min(compactName.length, compactQuery.length + 4))))
  return 10 - matchingWords * 2 + distance / Math.max(compactQuery.length, 1)
}

export default function ProductSearch({ mobile = false, onNavigate }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const normalizedQuery = normalize(query)
  const suggestions = useMemo(() => {
    if (normalizedQuery.length < 2) return []
    return products
      .map((product) => ({ product, score: rankProduct(product, normalizedQuery) }))
      .filter(({ product, score }) => normalize(product.name).includes(normalizedQuery) || score < 11.5)
      .sort((a, b) => a.score - b.score || a.product.name.localeCompare(b.product.name))
      .slice(0, 6)
      .map(({ product }) => product)
  }, [normalizedQuery])

  const selectProduct = (product) => {
    setQuery('')
    setFocused(false)
    setActiveIndex(-1)
    onNavigate?.()
    navigate(productPath(product))
  }

  const submit = (event) => {
    event.preventDefault()
    const product = suggestions[Math.max(activeIndex, 0)]
    if (product) selectProduct(product)
    else if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Escape') {
      setFocused(false)
      setActiveIndex(-1)
    }
  }

  const open = focused && normalizedQuery.length >= 2

  return <form className={`header-search${mobile ? ' mobile-search' : ''}`} role="search" onSubmit={submit}>
    <MdSearch aria-hidden="true"/>
    <label className="sr-only" htmlFor={mobile ? 'mobile-product-search' : 'desktop-product-search'}>Search products</label>
    <input
      id={mobile ? 'mobile-product-search' : 'desktop-product-search'}
      type="search"
      value={query}
      placeholder="Search products..."
      autoComplete="off"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={mobile ? 'mobile-search-results' : 'desktop-search-results'}
      aria-activedescendant={activeIndex >= 0 ? `${mobile ? 'mobile' : 'desktop'}-result-${activeIndex}` : undefined}
      onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1) }}
      onFocus={() => setFocused(true)}
      onBlur={() => window.setTimeout(() => setFocused(false), 150)}
      onKeyDown={onKeyDown}
    />
    {open && <div className="search-suggestions" id={mobile ? 'mobile-search-results' : 'desktop-search-results'} role="listbox">
      {suggestions.length ? suggestions.map((product, index) => <button
        type="button"
        role="option"
        aria-selected={index === activeIndex}
        id={`${mobile ? 'mobile' : 'desktop'}-result-${index}`}
        className={index === activeIndex ? 'active' : ''}
        key={product.id}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => selectProduct(product)}
      >
        <img src={getProductImage(product)} alt="" width="48" height="48"/>
        <span><strong>{niceName(product.name)}</strong><small>{product.family}</small></span>
      </button>) : <p>No close product matches found.</p>}
    </div>}
  </form>
}
