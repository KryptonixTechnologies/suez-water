import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdClose, MdMenu, MdShoppingCart } from 'react-icons/md'
import { useCart } from '../../context/cart-store'
import { SITE } from '../../config/site'
import ProductSearch from '../search/ProductSearch'
export default function Header(){const[open,setOpen]=useState(false),{count}=useCart();const closeMenu=()=>setOpen(false);return <header className="site-header"><NavLink className="brand" to="/" onClick={closeMenu}><img className="brand-logo" src={SITE.logo} alt={SITE.name}/></NavLink><ProductSearch/><nav className={open?'nav open':'nav'}><ProductSearch mobile onNavigate={closeMenu}/>{[['/','Home'],['/products','Products'],['/about','About'],['/projects','Projects'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} end={to==='/'} onClick={closeMenu}>{label}</NavLink>)}</nav><div className="header-actions"><button className="icon-button menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open?<MdClose/>:<MdMenu/>}</button><NavLink className="cart-button" to="/cart"><MdShoppingCart/><span>Cart</span>{count>0&&<b>{count}</b>}</NavLink></div></header>}
