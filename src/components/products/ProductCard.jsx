import { Link } from 'react-router-dom'
import { MdAddShoppingCart, MdOpenInNew } from 'react-icons/md'
import { useCart } from '../../context/cart-store'
import { familyDescriptions, niceName, productPath } from '../../utils/products'
import { getProductImage } from '../../utils/productImages'
export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const productName = niceName(product.name)
  return <article className="product-card">
    <Link className="product-image" to={productPath(product)}>
      <img src={getProductImage(product)} alt={productName} loading="lazy" decoding="async" width="360" height="320"/>
      <span className={`product-badge ${product.category === 'Water Treatment' ? 'water-badge' : 'solar-badge'}`}>{product.category === 'Water Treatment' ? 'Water treatment' : 'Solar energy'}</span>
      <span className="view-product">View details <MdOpenInNew/></span>
    </Link>
    <div className="product-info">
      <h3><Link to={productPath(product)}>{productName}</Link></h3>
      <p>{familyDescriptions[product.family]}</p>
      <div className="product-actions">
        <span className="quote-label"><small>Pricing</small>Request a quote</span>
        <button className="add-button" onClick={() => addItem(product)} aria-label={`Add ${productName} to cart`}><MdAddShoppingCart/><span>Add</span></button>
      </div>
    </div>
  </article>
}
