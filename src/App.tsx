import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Music } from 'lucide-react'
import './App.css'

// Pages
import Home from './pages/Home'
import Piano from './pages/Piano'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <nav>
            <Link to="/" className="logo">
              <Music size={32} className="logo-icon" />
              <h1>Jazz & Rock Music</h1>
            </Link>
            <div className="nav-links">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/piano">Piano</NavLink>
              <NavLink to="/lessons">Lessons</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/piano" element={<Piano />} />
            <Route path="/lessons" element={<div className="container">Lessons Page (Coming Soon)</div>} />
            <Route path="/about" element={<div className="container">About Page (Coming Soon)</div>} />
            <Route path="/contact" element={<div className="container">Contact Page (Coming Soon)</div>} />
          </Routes>
        </main>
        
        <footer>
          <div className="footer-content">
            <div className="footer-section">
              <h3>Jazz & Rock Music</h3>
              <p>Music lessons, performances, and interactive tools for aspiring musicians</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook"><Facebook size={24} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={24} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={24} /></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <Link to="/">Home</Link>
              <Link to="/piano">Interactive Piano</Link>
              <Link to="/lessons">Music Lessons</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: info@jazzrockmusic.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Address: 123 Music Street, Melody City</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Jazz & Rock Music. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
