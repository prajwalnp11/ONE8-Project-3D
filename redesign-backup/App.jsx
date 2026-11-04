import Product3D from "./components/Product3D";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Menu } from "lucide-react";
import "./App.css";
import ProductList from "./components/ProductList";

function App() {
  return (
    
    <div className="website">
      <div className="announcement">
        PERFORMANCE MEETS STYLE — EXPLORE THE COLLECTION
      </div>

      <nav className="navbar">
        <div className="logo">ONE8<span>.</span></div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#collections">Collections</a>
          <a href="#products">Products</a>
          <a href="#about">Our Story</a>
        </div>

        <div className="nav-actions">
          <ShoppingBag size={21} />
          <Menu size={23} className="mobile-menu" />
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              BUILT FOR THE BOLD
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              DEFINE YOUR
              <br />
              OWN GAME.
            </motion.h1>

            <p className="hero-description">
              Performance-driven sportswear.
              Designed for movement. Made for ambition.
            </p>

            <a href="#collections" className="shop-button">
              EXPLORE COLLECTION <ArrowRight size={18} />
            </a>
          </div>

          <div className="hero-visual">
  <div className="hero-circle"></div>

  <Product3D />

  <p className="vertical-text">
    MOVE WITHOUT LIMITS — 001
  </p>
</div>

          <div className="hero-bottom">
            <span>01 / 03</span>
            <span>SPORT · CULTURE · PERFORMANCE</span>
          </div>
        </section>

        <section className="collections" id="collections">
          <div className="section-heading">
            <p>EXPLORE THE WORLD OF ONE8</p>
            <h2>MADE TO MOVE.</h2>
          </div>

          <div className="collection-grid">
            {["FOOTWEAR", "APPAREL", "ACCESSORIES"].map((item, index) => (
              <motion.div
                className={`collection-card card-${index + 1}`}
                whileHover={{ y: -8 }}
                key={item}
              >
                <span>0{index + 1}</span>
                <h3>{item}</h3>
                <a href="#products">
                  EXPLORE <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="featured" id="products">
          <p>CURATED FOR PERFORMANCE</p>
          <h2>THE FEATURED EDIT.</h2>
          <p>Discover a new standard of everyday performance.</p>
          <a href="#about" className="dark-button">
            DISCOVER MORE <ArrowRight size={17} />
          </a>
        </section>
                <ProductList />

        <section className="about" id="about">
          <p>THE SPIRIT OF PERFORMANCE</p>
          <h2>DON'T FOLLOW THE GAME. DEFINE IT.</h2>
        </section>
      </main>

      <footer>
        <h2>ONE8.</h2>
        <p>PERFORMANCE. PURPOSE. PROGRESS.</p>
        <p>© 2026 ONE8 INSPIRED PORTFOLIO PROJECT</p>
      </footer>
    </div>
  );
}

export default App;
