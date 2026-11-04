import { useState, lazy, Suspense, useEffect, useRef, useMemo } from "react";
import {
  ArrowLeft,
  Rotate3D,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Layers,
  ShieldCheck,
  Camera,
} from "lucide-react";

import "./ProductDetail.css";

const Product3D = lazy(() => import("./Product3D"));

const DEFAULT_BRAND_COLORS = [
  { name: "Black", hex: "#171717" },
  { name: "White", hex: "#f5f5f2" },
  { name: "Sonic Blue", hex: "#36c6ce" },
  { name: "Trophy Gold", hex: "#b99a43" },
  { name: "Grey", hex: "#757575" },
];

/* ========================================================
   INTERACTIVE 360° REAL PRODUCT TURNTABLE
   Silky-smooth drag rotation through authentic product photos
   ======================================================== */
function Product360Viewer({ images = [], alt = "ONE8 360 View" }) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const dragStartX = useRef(0);
  const startIndex = useRef(0);

  // Preload all angle images into browser cache for instant transitions
  useEffect(() => {
    validImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [validImages]);

  // Smooth auto-rotation when idle
  useEffect(() => {
    if (!autoRotate || isDragging || validImages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging, validImages.length]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startIndex.current = index;
  };

  const handlePointerMove = (e) => {
    if (!isDragging || validImages.length <= 1) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX.current;
    const sensitivity = 36; // Pixels per angle step
    const steps = Math.floor(deltaX / sensitivity);
    const newIdx =
      (startIndex.current - steps + validImages.length * 100) % validImages.length;
    setIndex(newIdx);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  if (validImages.length === 0) return null;

  return (
    <div
      className="turntable-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      aria-label="360 degree product rotation stage"
    >
      <img
        src={validImages[index]}
        alt={`${alt} — Angle ${index + 1}`}
        className="turntable-image"
        draggable={false}
      />

      <div className="turntable-badge">
        <Rotate3D size={13} className={autoRotate ? "is-spinning" : ""} />
        <span>
          360° REAL PRODUCT · DRAG TO SPIN (ANGLE {index + 1} OF {validImages.length})
        </span>
      </div>

      <div className="turntable-dots">
        {validImages.map((_, i) => (
          <button
            key={i}
            className={`turntable-dot ${i === index ? "is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
              setAutoRotate(false);
            }}
            aria-label={`Jump to angle ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ========================================================
   PRODUCT DETAIL COMPONENT
   ======================================================== */
function ProductDetail({
  product,
  onClose,
  onSelectProduct = () => {},
  allProducts = [],
}) {
  const isFootwear = product.category === "footwear";
  const isApparel = product.category === "apparel";

  // Gallery images from Django
  const gallery = useMemo(() => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Colors
  const colors =
    product.available_colors && product.available_colors.length > 0
      ? product.available_colors
      : DEFAULT_BRAND_COLORS;

  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // Sizes
  const sizes =
    product.available_sizes && product.available_sizes.length > 0
      ? product.available_sizes
      : isFootwear
      ? ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
      : isApparel
      ? ["S", "M", "L", "XL", "XXL"]
      : [];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  // VIEW MODE:
  // "photo" -> Authentic Real Product Photography (DEFAULT)
  // "360" -> Interactive 360° Real Product Turntable
  // "3d-lab" -> 3D Object Lab with exploded view
  const [viewMode, setViewMode] = useState("photo");
  const [exploded, setExploded] = useState(false);
  const [added, setAdded] = useState(false);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const price = Number(product.price);

  const handleAddToBag = () => {
    if (sizes.length > 0 && !selectedSize) return;
    setAdded(true);
  };

  // Related products
  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.product_type === product.product_type)
    )
    .slice(0, 3);

  const activeImage = gallery[activeImgIndex] || product.image;

  return (
    <div
      className="detail-page"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* TOP BAR */}
      <header className="detail-topbar">
        <button
          className="detail-back"
          onClick={onClose}
          aria-label="Back to collection"
        >
          <ArrowLeft size={16} />
          BACK TO COLLECTION
        </button>

        <span className="detail-brand">
          ONE8<span>.</span>
        </span>

        <span className="detail-edition">
          {product.product_type
            ? product.product_type.toUpperCase()
            : "THE EDIT 2026"}
        </span>
      </header>

      {/* MAIN LAYOUT */}
      <main className="detail-layout">
        {/* GALLERY & 3D STAGE */}
        <section className="detail-gallery">
          {/* VIEW MODE TABS ON TOP OF STAGE */}
          <div className="stage-view-tabs" role="tablist" aria-label="View modes">
            <button
              role="tab"
              aria-selected={viewMode === "photo"}
              className={`stage-tab ${viewMode === "photo" ? "is-active" : ""}`}
              onClick={() => setViewMode("photo")}
            >
              <Camera size={13} />
              REAL PHOTOGRAPHY ({gallery.length})
            </button>

            {gallery.length > 1 && (
              <button
                role="tab"
                aria-selected={viewMode === "360"}
                className={`stage-tab ${viewMode === "360" ? "is-active" : ""}`}
                onClick={() => setViewMode("360")}
              >
                <Rotate3D size={13} />
                360° REAL TURNTABLE
              </button>
            )}

            {isFootwear && (
              <button
                role="tab"
                aria-selected={viewMode === "3d-lab"}
                className={`stage-tab ${viewMode === "3d-lab" ? "is-active" : ""}`}
                onClick={() => setViewMode("3d-lab")}
              >
                <Layers size={13} />
                3D OBJECT LAB
              </button>
            )}
          </div>

          {/* MAIN STAGE */}
          <div className="detail-image-stage">
            {viewMode === "photo" ? (
              activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="detail-main-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : (
                <div className="detail-no-image">
                  {(product.category || "ONE8").toUpperCase()}
                </div>
              )
            ) : viewMode === "360" ? (
              <Product360Viewer images={gallery} alt={product.name} />
            ) : (
              <Suspense
                fallback={
                  <div className="detail-loading">
                    <div className="detail-spinner" />
                    <span>LOADING 3D LAB...</span>
                  </div>
                }
              >
                <Product3D
                  color={selectedColor.hex}
                  exploded={exploded}
                />
              </Suspense>
            )}

            {/* STAGE FOOTER BADGES */}
            <div className="stage-badges">
              <span className="detail-image-number">
                {viewMode === "photo"
                  ? `0${activeImgIndex + 1} / 0${Math.max(gallery.length, 1)} AUTHENTIC PHOTOGRAPHY`
                  : viewMode === "360"
                  ? "360° DRAG TO ROTATE ALL ANGLES"
                  : "3D CAD LAB · EXPLORE ANATOMY"}
              </span>
            </div>
          </div>

          {/* STAGE ACTION CONTROLS */}
          <div className="detail-stage-controls">
            {viewMode === "photo" ? (
              gallery.length > 1 && (
                <button
                  className="detail-3d-toggle"
                  onClick={() => setViewMode("360")}
                >
                  <Rotate3D size={16} />
                  DRAG & ROTATE 360° IN REAL PHOTOGRAPHY
                </button>
              )
            ) : (
              <button
                className="detail-3d-toggle active"
                onClick={() => setViewMode("photo")}
              >
                <Camera size={16} />
                BACK TO AUTHENTIC PHOTOGRAPHY
              </button>
            )}

            {isFootwear && viewMode === "3d-lab" && (
              <button
                className={`detail-exploded-toggle ${exploded ? "active" : ""}`}
                onClick={() => setExploded(!exploded)}
              >
                <Layers size={15} />
                {exploded ? "ASSEMBLE" : "EXPLODED VIEW"}
              </button>
            )}
          </div>

          {/* MULTI-IMAGE THUMBNAIL STRIP */}
          {gallery.length > 1 && (
            <div
              className="detail-thumbnails-strip"
              aria-label="Product photography gallery"
            >
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`detail-thumb-btn ${
                    viewMode === "photo" && activeImgIndex === idx
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveImgIndex(idx);
                    setViewMode("photo");
                  }}
                  aria-label={`View photo angle ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Thumbnail angle ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <p className="detail-image-caption">
            ONE8 / PERFORMANCE LAB — AUTHENTIC HIGH-RES PRODUCT IMAGES & INTERACTIVE ROTATION
          </p>
        </section>

        {/* INFORMATION COLUMN */}
        <section className="detail-information">
          <div className="detail-product-heading">
            <p className="detail-eyebrow">
              ONE8 /{" "}
              {product.product_type
                ? product.product_type.toUpperCase()
                : (product.category || "").toUpperCase()}
            </p>

            <h1>{product.name}</h1>

            <div className="heading-meta-row">
              <span className="detail-price">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {product.is_featured && (
                <span className="detail-featured">FEATURED OBJECT</span>
              )}

              {product.is_available ? (
                <span className="detail-stock-badge in-stock">
                  <ShieldCheck size={12} /> OFFICIAL INVENTORY
                </span>
              ) : (
                <span className="detail-stock-badge sold-out">
                  ARCHIVED EDITION
                </span>
              )}
            </div>

            <p className="detail-description">{product.description}</p>
          </div>

          <div className="detail-separator" />

          {/* COLOUR SELECTOR */}
          <div className="detail-color-section">
            <div className="detail-section-heading">
              <span>SELECT COLOUR</span>
              <span>{selectedColor.name.toUpperCase()}</span>
            </div>

            <div className="detail-color-options">
              {colors.map((color, idx) => (
                <button
                  key={`${color.name}-${idx}`}
                  className={`detail-color-option ${
                    selectedColor.name === color.name ? "selected" : ""
                  }`}
                  style={{ "--swatch-color": color.hex }}
                  onClick={() => {
                    setSelectedColor(color);
                    setAdded(false);
                  }}
                  aria-label={`Select ${color.name}`}
                  title={color.name}
                >
                  {selectedColor.name === color.name && <Check size={14} />}
                </button>
              ))}
            </div>

            <p className="detail-size-note">
              {viewMode === "3d-lab"
                ? "Selected colour updates real-time 3D model."
                : "Switch to 3D Lab to preview interactive colourways."}
            </p>
          </div>

          <div className="detail-separator" />

          {/* SIZE SELECTOR */}
          {sizes.length > 0 && (
            <>
              <div className="detail-size-section">
                <div className="detail-section-heading">
                  <span>SELECT SIZE</span>
                  <span>{isFootwear ? "UK SHOE SIZE" : "APPAREL SIZE"}</span>
                </div>

                <div className="detail-sizes">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`detail-size ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedSize(size);
                        setAdded(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p className="detail-size-note">
                  Standard athletic fit. Conforms to authentic ONE8 performance sizing.
                </p>
              </div>

              <div className="detail-separator" />
            </>
          )}

          {/* QUANTITY */}
          <div className="detail-quantity-section">
            <span>QUANTITY</span>

            <div className="detail-quantity">
              <button
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </button>

              <span>{quantity}</span>

              <button
                aria-label="Increase quantity"
                disabled={quantity >= 10}
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* ADD TO BAG BUTTON */}
          <button
            className="detail-add-button"
            onClick={handleAddToBag}
            disabled={sizes.length > 0 && !selectedSize}
          >
            {added ? (
              <>
                <Check size={18} />
                ADDED TO DEMO BAG
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                ADD TO DEMO BAG — ₹{(price * quantity).toLocaleString("en-IN")}
              </>
            )}
          </button>

          {added && (
            <p className="detail-success">
              ✓ Object added to your portfolio shopping session. Real checkout and payments are intentionally disabled.
            </p>
          )}

          {/* PRODUCT SPECIFICATIONS */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="detail-specs-box">
                <h3>PRODUCT SPECIFICATIONS</h3>
                <dl className="specs-list">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="spec-row">
                      <dt>{key.toUpperCase()}</dt>
                      <dd>{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

          {/* BRAND PILLARS */}
          <div className="detail-bottom-info">
            <div>
              <span>01</span>
              <p>PRECISION MOVEMENT & ATHLETIC DISCIPLINE</p>
            </div>
            <div>
              <span>02</span>
              <p>CO-CREATED WITH VIRAT KOHLI</p>
            </div>
            <div>
              <span>03</span>
              <p>DEFINE YOUR OWN GAME — 2026</p>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {related.length > 0 && (
            <div className="detail-related-section">
              <h3>RELATED OBJECTS</h3>
              <div className="related-grid">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    className="related-card"
                    onClick={() => onSelectProduct(rel)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="related-image">
                      {rel.image ? (
                        <img src={rel.image} alt={rel.name} loading="lazy" />
                      ) : (
                        <span>ONE8</span>
                      )}
                    </div>
                    <h4>{rel.name}</h4>
                    <p>₹{Number(rel.price).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="detail-footer">
        <span>ONE8 — DEFINE YOUR OWN GAME</span>
        <span>INDEPENDENT PORTFOLIO CONCEPT · NOT AN OFFICIAL STORE</span>
      </footer>
    </div>
  );
}

export default ProductDetail;
