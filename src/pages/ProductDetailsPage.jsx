import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdAdd, MdArrowBack, MdCheckCircle, MdRemove } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { products } from '../data/products'
import { whatsappUrl } from '../config/site'
import { useCart } from '../context/cart-store'
import { familyDescriptions, niceName } from '../utils/products'
import { getProductImage } from '../utils/productImages'
import ProductGrid from '../components/products/ProductGrid'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  if (!product) {
    return <section className="not-found"><h1>Product not found</h1><Link to="/products">Return to products</Link></section>
  }

  const productName = niceName(product.name)
  const related = products.filter((item) => item.family === product.family && item.id !== product.id).slice(0, 4)
  const buyMessage = `Hi Suez Water, I'd like to buy ${quantity} x ${productName} (Item ${product.id}). Please let me know the price and availability.`

  return <>
    <section className="product-detail">
      <div className="detail-image">
        <Link to="/products" className="back-link"><MdArrowBack/> Back to products</Link>
        <img src={getProductImage(product)} alt={productName}/>
      </div>
      <div className="detail-copy">
        <span className="section-kicker">{product.category}</span>
        <small>{product.family} · Item #{product.id}</small>
        <h1>{productName}</h1>
        <p>{familyDescriptions[product.family]} Our team can confirm compatibility, current availability, project sizing and recommended supporting components.</p>
        <ul>{['Professional product guidance', 'Suitable for tailored project quotations', 'Delivery and installation support available'].map((item) => <li key={item}><MdCheckCircle/>{item}</li>)}</ul>
        <div className="detail-purchase">
          <div className="quantity">
            <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><MdRemove/></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity"><MdAdd/></button>
          </div>
          <button className="primary" onClick={() => addItem(product, quantity)}>Add to cart</button>
          <a className="whatsapp-buy" href={whatsappUrl(buyMessage)} target="_blank" rel="noreferrer"><FaWhatsapp/> Buy on WhatsApp</a>
        </div>
      </div>
    </section>
    <section className="related-section">
      <div className="section-heading"><div><span className="section-kicker">You may also need</span><h2>Related products</h2></div><Link to={`/products?category=${encodeURIComponent(product.category)}`}>View category</Link></div>
      <ProductGrid products={related}/>
    </section>
  </>
}
