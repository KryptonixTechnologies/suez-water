import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="products" element={<ProductsPage />} /><Route path="products/:productSlug" element={<ProductDetailsPage />} /><Route path="about" element={<AboutPage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="contact" element={<ContactPage />} /><Route path="cart" element={<CartPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes>
}
