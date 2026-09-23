import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdArrowForward, MdRemove, MdAdd, MdShoppingCart, MdDeleteOutline } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { products } from '../data/products'
import { productUrl, whatsappUrl } from '../config/site'
import { useCart } from '../context/cart-store'
import { niceName, productPath } from '../utils/products'
import { getProductImage } from '../utils/productImages'
export default function CartPage(){const{items,count,setQuantity,removeItem,clearCart}=useCart(),navigate=useNavigate();const lines=Object.entries(items).map(([id,quantity])=>({product:products.find(p=>p.id===id),quantity})).filter(x=>x.product);const checkout=()=>{const list=lines.map(({product,quantity},index)=>[
  `*${index+1}. ${niceName(product.name)}*`,
  `Item code: #${product.id}`,
  `Quantity: ${quantity}`,
  `Product link: ${productUrl(product)}`,
].join('\n')).join('\n\n');const message=[
  'Hello Suez Water & Energy Technologies,',
  '',
  'I would like a quotation for the products in my cart:',
  '',
  list,
  '',
  '*Order summary*',
  `Different products: ${lines.length}`,
  `Total quantity: ${count}`,
  '',
  'Please confirm availability, unit prices, the total quotation, and delivery options.',
  '',
  'Thank you.',
].join('\n');window.open(whatsappUrl(message),'_blank','noopener,noreferrer')};const confirmClear=async()=>{const result=await Swal.fire({icon:'warning',title:'Clear your cart?',text:'All selected products will be removed.',showCancelButton:true,confirmButtonText:'Clear cart',confirmButtonColor:'#0d4035'});if(result.isConfirmed)clearCart()};return <><section className="cart-page cart-page-compact">{lines.length?<><div className="cart-page-list">{lines.map(({product,quantity})=><article key={product.id}><img src={getProductImage(product)} alt={niceName(product.name)}/><div className="cart-line-info"><small>{product.family} · #{product.id}</small><Link to={productPath(product)}>{niceName(product.name)}</Link><span>Price confirmed on enquiry</span></div><div className="quantity"><button onClick={()=>setQuantity(product.id,quantity-1)}><MdRemove/></button><span>{quantity}</span><button onClick={()=>setQuantity(product.id,quantity+1)}><MdAdd/></button></div><button className="remove-line" onClick={()=>removeItem(product.id)} aria-label="Remove product"><MdDeleteOutline/></button></article>)}<button className="clear-cart" onClick={confirmClear}>Clear all items</button></div><aside className="cart-summary"><span className="section-kicker">Summary</span><h2>{count} {count===1?'item':'items'}</h2><div><span>Products selected</span><strong>{lines.length}</strong></div><div><span>Total quantity</span><strong>{count}</strong></div><p>No payment is taken online. Your product list opens as a pre-filled WhatsApp message where availability, pricing and delivery can be discussed.</p><button className="primary" onClick={checkout}>Buy on WhatsApp <FaWhatsapp/></button><Link to="/products"><MdArrowBack/> Continue browsing</Link></aside></>:<div className="empty-cart-page"><span><MdShoppingCart/></span><h2>Your cart is empty</h2><p>Browse the catalog and add any products you would like us to quote.</p><button className="primary" onClick={()=>navigate('/products')}>Explore products <MdArrowForward/></button></div>}</section></>}
