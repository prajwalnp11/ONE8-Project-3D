
import { useEffect, useState } from "react";
import { X, Rotate3D, Layers3 } from "lucide-react";
import Product3D from "./Product3D";

function ShoeConfigurator({ product, onClose }) {
  const materials = [
    {
      name: "Upper",
      material: "Engineered mesh",
      purpose: "Breathability and lightweight support.",
    },
    {
      name: "Lining",
      material: "Soft textile",
      purpose: "Comfort around the foot.",
    },
    {
      name: "Insole",
      material: "Cushioning foam",
      purpose: "Underfoot comfort.",
    },
    {
      name: "Midsole",
      material: "EVA foam",
      purpose: "Shock absorption and cushioning.",
    },
    {
      name: "Outsole",
      material: "Rubber",
      purpose: "Traction and durability.",
    },
    {
      name: "Laces",
      material: "Polyester",
      purpose: "Adjustable and secure fit.",
    },
  ];

  return (
    <div className="configurator">
      <button className="config-close" onClick={onClose}>
        <X size={24} /> CLOSE
      </button>

      <div className="config-header">
        <span>ONE8 / PRODUCT LAB</span>
        <span>01 — FOOTWEAR</span>
      </div>

      <div className="config-layout">
        <div className="config-visual">
          <span className="visual-label">INTERACTIVE 3D VIEW</span>

          <Product3D />

          <div className="rotate-hint">
            <Rotate3D size={18} />
            DRAG TO ROTATE 360°
          </div>
        </div>

        <aside className="config-info">
          <p className="config-kicker">PERFORMANCE FOOTWEAR</p>

          <h1>{product.name}</h1>

          <h2>₹{Number(product.price).toLocaleString("en-IN")}</h2>

          <p className="config-description">
            {product.description}
          </p>

          <div className="config-divider" />

          <h3>
            <Layers3 size={18} />
            MATERIAL CONSTRUCTION
          </h3>

          <div className="material-list">
            {materials.map((item, index) => (
              <div className="material-item" key={item.name}>
                <span className="material-number">
                  0{index + 1}
                </span>

                <div>
                  <strong>{item.name}</strong>
                  <p>{item.material}</p>
                  <small>{item.purpose}</small>
                </div>
              </div>
            ))}
          </div>

          <p className="material-note">
            Demonstration material information.
            Not verified specifications of an official product.
          </p>
        </aside>
      </div>

      <div className="config-footer">
        <span>ONE8 — DEFINE YOUR OWN GAME</span>
        <span>DRAG · ROTATE · EXPLORE</span>
      </div>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Unable to load products: {error}</p>;

  return (
    <>
      <section className="product-list" id="product-catalogue">
        <h2>OUR COLLECTION</h2>
        <p className="catalogue-subtitle">
          DISCOVER PERFORMANCE. EXPLORE EVERY DETAIL.
        </p>

        <div className="product-grid">
          {products.map((product) => (
            <article
              className="product-card"
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span>{product.category.toUpperCase()}</span>
                )}
              </div>

              <p className="product-category">
                {product.category.toUpperCase()}
              </p>

              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <div className="product-card-bottom">
                <strong>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </strong>
                <span>EXPLORE PRODUCT ↗</span>
              </div>

              {product.is_featured && (
                <span className="featured-label">FEATURED</span>
              )}
            </article>
          ))}
        </div>
      </section>

      {selectedProduct && (
        selectedProduct.category === "footwear" ? (
          <ShoeConfigurator
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        ) : (
          <div className="product-message">
            <button onClick={() => setSelectedProduct(null)}>
              <X size={20} /> CLOSE
            </button>
            <p>{selectedProduct.category.toUpperCase()}</p>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <strong>
              ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
            </strong>
            <p>Detailed 3D product experience coming in a later stage.</p>
          </div>
        )
      )}
    </>
  );
}

export default ProductList;
