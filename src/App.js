import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
// import ProductDetailPage from './pages/ProductDetailPage';
// import Cart from './pages/Cart';
// import Profile from './pages/Profile';
// import Reviews from './pages/Reviews';
// import Community from './pages/Community';
import Register from './pages/Register';

// Context Providers
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <CartProvider>
          <div className="App">
            <Header />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              {/* <Route path="/producto-detalle/:codigo" element={<ProductDetailPage />} /> */}
              {/* <Route path="/carrito" element={<Cart />} /> */}
              {/* <Route path="/perfil" element={<Profile />} /> */}
              {/* <Route path="/resenas" element={<Reviews />} /> */}
              {/* <Route path="/comunidad" element={<Community />} /> */}
              <Route path="/registro" element={<Register />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
