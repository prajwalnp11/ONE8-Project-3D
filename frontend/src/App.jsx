
import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowRight,
  Menu,
  X,
  MoveUpRight,
} from "lucide-react";

import ProductList from "./components/ProductList";
import WelcomeScreen from "./components/WelcomeScreen";
import "./App.css";

// Lazy-load the 3D sneaker component
const Product3D = lazy(() => import("./components/Product3D"));

const collections = [
  {
    number: "01",
    name: "FOOTWEAR",
    categoryKey: "footwear",
    detail: "Built to go further.",
    className: "collection-footwear",
    href: "#product-catalogue",
  },
  {
    number: "02",
    name: "APPAREL",
    categoryKey: "apparel",
    detail: "Made for every move.",
    className: "collection-apparel",
    href: "#product-catalogue",
  },
  {
    number: "03",
    name: "ACCESSORIES",
    categoryKey: "accessories",
    detail: "The finishing details.",
    className: "collection-accessories",
    href: "#product-catalogue",
  },
];

function ArrowUpRightIcon() {
  return <MoveUpRight size={19} strokeWidth={1.5} />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [catalogueCategory, setCatalogueCategory] = useState("all");

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* WELCOME SCREEN */}
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen
            key="welcome"
            onComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>

      {/* MAIN WEBSITE */}
      <div className="website">

        {/* ANNOUNCEMENT */}
        <div className="announcement">
          <span>PERFORMANCE IS A MINDSET</span>

          <span className="announcement-index">
            INDEPENDENT PORTFOLIO CONCEPT&nbsp; / &nbsp;2026
          </span>
        </div>

        {/* HEADER */}
        <header className="site-header">

          <a
            className="wordmark"
            href="#home"
            aria-label="ONE8 home"
          >
            ONE8<span>.</span>
          </a>

          <nav
            className={`primary-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#collections" onClick={closeMenu}>
              COLLECTIONS
            </a>

            <a href="#product-catalogue" onClick={closeMenu}>
              THE EDIT
            </a>

            <a href="#story" onClick={closeMenu}>
              OUR PHILOSOPHY
            </a>
          </nav>

          <div className="header-right">

            <a
              className="header-cta"
              href="#product-catalogue"
            >
              EXPLORE <MoveUpRight size={14} />
            </a>

            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>
        </header>

        <main>

          {/* HERO SECTION */}
          <section className="hero" id="home">

            <div
              className="hero-grain"
              aria-hidden="true"
            />

            <div className="hero-copy">

              <motion.p
                className="eyebrow hero-eyebrow"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                THE PURSUIT OF MORE&nbsp; — &nbsp;EST. IN MOTION
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08 }}
              >
                DEFINE
                <br />
                YOUR <span>OWN</span>
                <br />
                GAME<span className="hero-period">.</span>
              </motion.h1>

              <motion.div
                className="hero-bottom-copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <p>
                  A study in movement, discipline and everyday performance.
                  Designed around the belief that progress has no finish line.
                </p>

                <a
                  className="circle-link"
                  href="#collections"
                  aria-label="Explore collections"
                >
                  <ArrowDownRight size={22} />
                </a>
              </motion.div>

            </div>

            {/* 3D SNEAKER - LAZY LOADED */}
            <div
              className="hero-art"
              aria-label="Interactive three-dimensional sneaker concept"
            >

              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />

              <div className="hero-art-label hero-art-label-top">
                OBJECT&nbsp; / &nbsp;001
              </div>

              <div className="hero-shoe">

                {!showWelcome && (
                  <Suspense
                    fallback={
                      <div className="product3d-loading">
                        LOADING 3D EXPERIENCE...
                      </div>
                    }
                  >
                    <Product3D />
                  </Suspense>
                )}

              </div>

              <div className="hero-art-label hero-art-label-bottom">
                FORM FOLLOWS FUNCTION
              </div>

              <span className="hero-side-note">
                MOVE WITH INTENT — 001
              </span>

            </div>

            <div className="hero-index">
              <span>01 — 03</span>

              <span>
                SPORT&nbsp; / &nbsp;CULTURE&nbsp; / &nbsp;PERFORMANCE
              </span>
            </div>

          </section>

          {/* BRAND STATEMENT */}
          <section
            className="manifesto-strip"
            aria-label="Brand statement"
          >
            <span>NO SHORTCUTS</span>
            <span className="manifesto-star">✳</span>
            <span>NO LIMITS</span>
            <span className="manifesto-star">✳</span>
            <span>JUST THE WORK</span>
            <span className="manifesto-star">✳</span>
            <span>NO SHORTCUTS</span>
          </section>

          {/* COLLECTIONS */}
          <section
            className="collections section-shell"
            id="collections"
          >

            <div className="section-topline">

              <span className="eyebrow">
                01 / THE UNIVERSE
              </span>

              <span className="section-aside">
                PURPOSEFUL DESIGN. EVERYDAY MOVEMENT.
              </span>

            </div>

            <div className="section-heading-row">

              <h2>
                MADE TO
                <br />
                <em>MOVE.</em>
              </h2>

              <p>
                Three expressions. One point of view.
                <br />
                Find your own way forward.
              </p>

            </div>

            <div className="collection-grid">

              {collections.map((item) => (
                <motion.a
                  className={`collection-card ${item.className}`}
                  href={item.href}
                  key={item.number}
                  onClick={() => setCatalogueCategory(item.categoryKey)}
                  whileHover={{ y: -7 }}
                  transition={{ duration: 0.25 }}
                >

                  <div
                    className="collection-visual"
                    aria-hidden="true"
                  >
                    <span className="collection-visual-mark">
                      {item.number}
                    </span>

                    <span className="collection-visual-shape" />

                    <span className="collection-visual-caption">
                      ONE8 / OBJECT STUDY
                    </span>
                  </div>

                  <div className="collection-card-meta">

                    <div>

                      <span className="collection-number">
                        {item.number} / CATEGORY
                      </span>

                      <h3>{item.name}</h3>

                      <p>{item.detail}</p>

                    </div>

                    <span className="collection-arrow">
                      <ArrowUpRightIcon />
                    </span>

                  </div>

                </motion.a>
              ))}

            </div>
          </section>

          {/* FEATURED BANNER */}
          <section className="feature-banner">

            <div className="feature-banner-content">

              <span className="eyebrow">
                02 / THE FEATURED EDIT
              </span>

              <h2>
                BUILT FOR
                <br />
                <em>WHAT'S NEXT.</em>
              </h2>

              <p>
                Explore the current selection of performance-inspired
                essentials.
              </p>

              <a
                className="light-link"
                href="#product-catalogue"
              >
                DISCOVER THE EDIT <ArrowRight size={16} />
              </a>

            </div>

            <div className="feature-banner-number">
              08
            </div>

            <div
              className="feature-banner-ring"
              aria-hidden="true"
            />

          </section>

          {/* PRODUCT CATALOGUE */}
          <section
            className="product-catalogue"
            id="product-catalogue"
          >

            <div className="catalogue-intro">

              <div>

                <span className="eyebrow">
                  03 / SELECTED OBJECTS
                </span>

                <h2>
                  THE COLLECTION<span>.</span>
                </h2>

              </div>

              <p>
                Considered pieces for training, movement
                <br />
                and everything in between.
              </p>

            </div>

            <ProductList
              externalCategory={catalogueCategory}
              onCategoryChange={setCatalogueCategory}
            />

          </section>

          {/* PHILOSOPHY */}
          <section
            className="story-section"
            id="story"
          >

            <div className="story-side">

              <span className="eyebrow">
                04 / THE PHILOSOPHY
              </span>

              <span className="story-index">
                A DIFFERENT
                <br />
                POINT OF VIEW.
              </span>

            </div>

            <div className="story-main">

              <p className="story-kicker">
                THE SPIRIT OF PERFORMANCE
              </p>

              <h2>
                DON'T FOLLOW
                <br />
                THE GAME.
                <br />
                <em>DEFINE IT.</em>
              </h2>

              <div className="story-bottom">

                <p>
                  Performance begins long before the finish line. It lives
                  in the choices, the discipline and the decision to keep
                  moving.
                </p>

                <a
                  href="#home"
                  className="text-link"
                >
                  BACK TO THE TOP <ArrowDownRight size={16} />
                </a>

              </div>

            </div>

          </section>

        </main>

        {/* FOOTER */}
        <footer className="site-footer">

          <div className="footer-top">

            <a
              className="footer-wordmark"
              href="#home"
            >
              ONE8<span>.</span>
            </a>

            <p>PERFORMANCE IS A MINDSET.</p>

            <a
              className="back-top"
              href="#home"
            >
              BACK TO TOP <ArrowDownRight size={16} />
            </a>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 ONE8-INSPIRED PORTFOLIO PROJECT
            </span>

            <span>
              INDEPENDENT CONCEPT&nbsp; / &nbsp;NOT AN OFFICIAL BRAND WEBSITE
            </span>

            <div className="footer-socials">
              <span>SPORT · CULTURE · PERFORMANCE</span>
            </div>

          </div>

        </footer>

      </div>
    </>
  );
}

export default App;
