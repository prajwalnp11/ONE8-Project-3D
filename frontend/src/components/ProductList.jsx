import { useEffect, useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, Rotate3D, ChevronDown } from "lucide-react";
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

const SORT_OPTIONS = [
  { id: "featured", label: "FEATURED FIRST" },
  { id: "price_asc", label: "PRICE: LOW TO HIGH" },
  { id: "price_desc", label: "PRICE: HIGH TO LOW" },
  { id: "name", label: "NAME: A — Z" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleCategorySelect = (catId) => {
    setInternalCategory(catId);
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
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (sortBy) {
        params.append("ordering", sortBy);
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
  }, [activeCategory, searchQuery, sortBy]);

  const visibleProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
  };

  return (
    <>
      <div className="catalogue-controls-wrapper">
        {/* CATEGORY FILTER TABS */}
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

        {/* SEARCH & SORT TOOLBAR */}
        <div className="catalogue-toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="SEARCH THE COLLECTION..."
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

        {/* COUNT META */}
        <div className="catalogue-meta-row">
          <span className="catalogue-count">
            {products.length} {products.length === 1 ? "OBJECT FOUND" : "OBJECTS IN THE EDIT"}
          </span>
          <span className="catalogue-spec-tag">
            PORTFOLIO CONCEPT / AUTHENTIC ONE8 SPECIFICATIONS
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
              setActiveCategory("all");
              setSearchQuery("");
            }}
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const has3D = product.model_3d_type && product.model_3d_type !== "none";
              const price = Number(product.price);

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
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="product-image-fallback"
                      style={{ display: product.image ? "none" : "flex" }}
                    >
                      <span>{(product.product_type || product.category || "ONE8").toUpperCase()}</span>
                    </div>

                    {has3D && (
                      <span className="badge-3d" title="Interactive 3D model available">
                        <Rotate3D size={11} /> 3D VIEW
                      </span>
                    )}

                    {product.is_featured && (
                      <span className="featured-label">FEATURED</span>
                    )}
                  </div>

                  <p className="product-category">
                    {product.product_type
                      ? product.product_type.toUpperCase()
                      : (product.category || "").toUpperCase()}
                  </p>

                  <h3>{product.name}</h3>

                  <p className="product-desc-snippet">{product.description}</p>

                  <div className="product-card-bottom">
                    <strong>₹{price.toLocaleString("en-IN")}</strong>
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
