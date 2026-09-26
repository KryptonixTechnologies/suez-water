import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MdAdd, MdArrowBack, MdCheckCircle, MdRemove } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { products } from '../data/products'
import { productUrl, whatsappUrl } from '../config/site'
import { useCart } from '../context/cart-store'
import { niceName, productPath, productSlug } from '../utils/products'
import { getProductImage } from '../utils/productImages'
import { getProductDetails } from '../utils/productDetails'
import ProductGrid from '../components/products/ProductGrid'

export default function ProductDetailsPage() {
  const { productSlug: routeSlug } = useParams()
  const product = products.find((item) => productSlug(item.name) === routeSlug || item.id === routeSlug)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  if (!product) {
    return <section className="not-found"><h1>Product not found</h1><Link to="/products">Return to products</Link></section>
  }

  if (routeSlug !== productSlug(product.name)) {
    return <Navigate to={productPath(product)} replace/>
  }

  const productName = niceName(product.name)
  const details = getProductDetails(product)
  const related = products.filter((item) => item.family === product.family && item.id !== product.id).slice(0, 4)
  const buyMessage = [
    'Hello Suez Water & Energy Technologies,',
    '',
    'I am interested in purchasing the following product:',
    '',
    `*Product:* ${productName}`,
    `*Item code:* #${product.id}`,
    `*Quantity:* ${quantity}`,
    `*Product link:* ${productUrl(product)}`,
    '',
    'Please confirm its availability, price, delivery options, and any other information I should know.',
    '',
    'Thank you.',
  ].join('\n')

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
        <p>{details.summary}</p>
        <dl className="detail-specs">{details.specs.map(({ label, value }, index) => <div key={`${label}-${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {details.caution && <p className="detail-caution">{details.caution}</p>}
        <ul>{details.benefits.map((item) => <li key={item}><MdCheckCircle/>{item}</li>)}</ul>
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
