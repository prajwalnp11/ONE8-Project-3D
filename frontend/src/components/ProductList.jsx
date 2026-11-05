import { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Rotate3D,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import "./ProductList.css";
import ProductDetail from "./ProductDetail";

const CATEGORIES = [
  { id: "all", label: "ALL OBJECTS" },
  { id: "cricket", label: "CRICKET" },
  { id: "running", label: "RUNNING & TRAINING" },
  { id: "t-shirts", label: "T-SHIRTS" },
  { id: "polos", label: "POLOS" },
  { id: "outerwear", label: "OUTERWEAR" },
  { id: "bottoms", label: "PANTS & SHORTS" },
  { id: "accessories", label: "CAPS & ACCESSORIES" },
];

const SUBCATEGORY_MAP = {
  cricket: ["Cricket Spikes", "Cricket Training Shoes", "Cricket Bats", "Cricket Balls"],
  running: ["Performance Running", "Lightweight Running", "Trail Running", "Daily Training"],
  "t-shirts": ["Performance T-Shirts"],
  polos: ["Polo T-shirts"],
  outerwear: ["Jackets & Hoodies", "Tracksuits"],
  bottoms: ["Training Shorts", "Track Pants & Joggers"],
  accessories: ["Caps", "Cricket Bats", "Cricket Balls", "Water Bottles", "Sports Bags", "Socks"],
};

const SORT_OPTIONS = [
  { id: "featured", label: "FEATURED FIRST" },
  { id: "newest", label: "NEWEST EDITIONS" },
  { id: "price_asc", label: "PRICE: LOW TO HIGH" },
  { id: "price_desc", label: "PRICE: HIGH TO LOW" },
  { id: "name", label: "NAME: A — Z" },
];

const PRICE_TIERS = [
  { id: "all", label: "ALL PRICES", min: null, max: null },
  { id: "under_3k", label: "UNDER ₹3,000", min: null, max: 3000 },
  { id: "3k_7k", label: "₹3,000 — ₹7,000", min: 3000, max: 7000 },
  { id: "7k_15k", label: "₹7,000 — ₹15,000", min: 7000, max: 15000 },
  { id: "above_15k", label: "ABOVE ₹15,000", min: 15000, max: null },
];

const PAGE_SIZE = 12;

function ProductList({ externalCategory = null, onCategoryChange = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters & State
  const [internalCategory, setInternalCategory] = useState(externalCategory || "all");
  const activeCategory = externalCategory || internalCategory;
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceTier, setPriceTier] = useState("all");
  const [only3D, setOnly3D] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleCategorySelect = (catId) => {
    setInternalCategory(catId);
    setSelectedSubCategory("");
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
  };

  // Fetch from Django API
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      let url = "/api/products/";
      const params = new URLSearchParams();

      if (activeCategory !== "all") {
        params.append("category", activeCategory);
      }
      if (selectedSubCategory) {
        params.append("sub_category", selectedSubCategory);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (sortBy) {
        params.append("ordering", sortBy);
      }
      if (only3D) {
        params.append("has_3d", "true");
      }

      const activeTier = PRICE_TIERS.find((t) => t.id === priceTier);
      if (activeTier?.min !== null && activeTier?.min !== undefined) {
        params.append("min_price", String(activeTier.min));
      }
      if (activeTier?.max !== null && activeTier?.max !== undefined) {
        params.append("max_price", String(activeTier.max));
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load products from server");
        const data = await res.json();
        if (!ignore) {
          setProducts(data);
          setVisibleCount(PAGE_SIZE);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [activeCategory, selectedSubCategory, searchQuery, sortBy, priceTier, only3D]);

  const visibleProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
  };

  const currentSubCategories = SUBCATEGORY_MAP[activeCategory] || [];

  return (
    <>
      <div className="catalogue-controls-wrapper">
        {/* MAIN CATEGORY TABS */}
        <div className="category-filter-bar" role="tablist" aria-label="Product categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`category-tab ${activeCategory === cat.id ? "is-active" : ""}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SUBCATEGORY PILLS */}
        {currentSubCategories.length > 0 && (
          <div className="subcategories-bar" role="toolbar" aria-label="Subcategories">
            <button
              className={`subcategory-pill ${selectedSubCategory === "" ? "is-active" : ""}`}
              onClick={() => setSelectedSubCategory("")}
            >
              ALL {activeCategory.toUpperCase()}
            </button>
            {currentSubCategories.map((sub) => (
              <button
                key={sub}
                className={`subcategory-pill ${selectedSubCategory === sub ? "is-active" : ""}`}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? "" : sub)}
              >
                {sub.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* SEARCH, SORT, PRICE TIERS & 3D FILTER TOOLBAR */}
        <div className="catalogue-toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS, PERFORMANCE SPECS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* 3D ONLY TOGGLE */}
            <button
              className={`filter-3d-toggle ${only3D ? "is-active" : ""}`}
              onClick={() => setOnly3D(!only3D)}
              title="Show only products with 3D models"
            >
              <Rotate3D size={13} />
              <span>3D MODELS ONLY</span>
            </button>

            {/* PRICE FILTER SELECT */}
            <div className="sort-group">
              <span className="sort-label">PRICE:</span>
              <div className="sort-select-shell">
                <select
                  value={priceTier}
                  onChange={(e) => setPriceTier(e.target.value)}
                  aria-label="Filter by price"
                >
                  {PRICE_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
            </div>

            {/* SORT SELECT */}
            <div className="sort-group">
              <span className="sort-label">
                <SlidersHorizontal size={13} />
                SORT:
              </span>
              <div className="sort-select-shell">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
            </div>
          </div>
        </div>

        {/* COUNT META */}
        <div className="catalogue-meta-row">
          <span className="catalogue-count">
            {products.length} {products.length === 1 ? "OBJECT FOUND" : "OBJECTS IN THE EDIT"}
          </span>
          <span className="catalogue-spec-tag">
            PORTFOLIO CONCEPT / AUTHENTIC ONE8 SPECIFICATIONS & 3D MODELS
          </span>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="catalogue-status-box">
          <div className="catalogue-spinner" />
          <p>LOADING COLLECTION...</p>
        </div>
      ) : error ? (
        <div className="catalogue-status-box">
          <p className="catalogue-error">Unable to load collection: {error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="catalogue-status-box">
          <p>NO PRODUCTS MATCHED YOUR SELECTION.</p>
          <button
            className="reset-filter-btn"
            onClick={() => {
              handleCategorySelect("all");
              setSearchQuery("");
              setPriceTier("all");
              setOnly3D(false);
            }}
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const has3D =
                product.model_3d_type &&
                product.model_3d_type !== "none" &&
                product.model_3d_type !== "";
              const originalPrice = Number(product.price);
              const salePrice = product.sale_price ? Number(product.sale_price) : null;
              const currentPrice = salePrice || originalPrice;

              return (
                <article
                  className="product-card"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedProduct(product);
                    }
                  }}
                  aria-label={`Explore ${product.name}`}
                >
                  <div className="product-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="product-image-fallback"
                      style={{ display: product.image ? "none" : "flex" }}
                    >
                      <span>
                        {(product.sub_category ||
                          product.product_type ||
                          product.category ||
                          "ONE8"
                        ).toUpperCase()}
                      </span>
                    </div>

                    {has3D && (
                      <span className="badge-3d" title="Interactive 3D model available">
                        <Rotate3D size={11} /> 3D LAB
                      </span>
                    )}

                    {product.is_featured && (
                      <span className="featured-label">FEATURED</span>
                    )}

                    {salePrice && (
                      <span className="card-sale-tag">SALE</span>
                    )}
                  </div>

                  <p className="product-category">
                    {product.sub_category
                      ? product.sub_category.toUpperCase()
                      : product.product_type
                      ? product.product_type.toUpperCase()
                      : (product.category || "").toUpperCase()}
                  </p>

                  <h3>{product.name}</h3>

                  <p className="product-desc-snippet">{product.description}</p>

                  {/* COLOR SWATCH PREVIEWS */}
                  {product.available_colors && product.available_colors.length > 1 && (
                    <div className="card-colors-preview">
                      {product.available_colors.slice(0, 5).map((c, i) => (
                        <span
                          key={i}
                          className="card-color-dot"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      {product.available_colors.length > 5 && (
                        <span style={{ fontSize: 9, color: "#888" }}>
                          +{product.available_colors.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="product-card-bottom">
                    <div className="card-price-group">
                      <strong>₹{currentPrice.toLocaleString("en-IN")}</strong>
                      {salePrice && (
                        <span className="card-original-price">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <span>EXPLORE OBJECT ↗</span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* LOAD MORE BUTTON */}
          {visibleCount < products.length && (
            <div className="load-more-row">
              <button className="load-more-btn" onClick={handleLoadMore}>
                LOAD MORE OBJECTS ({products.length - visibleCount} REMAINING)
              </button>
            </div>
          )}
        </>
      )}

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetail
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          allProducts={products}
        />
      )}
    </>
  );
}

export default ProductList;
