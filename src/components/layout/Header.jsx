import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdClose, MdMenu, MdShoppingCart } from 'react-icons/md'
import { useCart } from '../../context/cart-store'
import { SITE } from '../../config/site'
export default function Header(){const[open,setOpen]=useState(false),{count}=useCart();return <header className="site-header"><NavLink className="brand" to="/" onClick={()=>setOpen(false)}><img className="brand-logo" src={SITE.logo} alt={SITE.name}/></NavLink><nav className={open?'nav open':'nav'}>{[['/','Home'],['/products','Products'],['/about','About'],['/projects','Projects'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}>{label}</NavLink>)}</nav><div className="header-actions"><button className="icon-button menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<MdClose/>:<MdMenu/>}</button><NavLink className="cart-button" to="/cart"><MdShoppingCart/><span>Cart</span>{count>0&&<b>{count}</b>}</NavLink></div></header>}
