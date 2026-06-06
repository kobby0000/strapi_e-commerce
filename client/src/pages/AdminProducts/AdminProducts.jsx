import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";
import { resolveAssetUrl } from "../../config/env";
import "./AdminProducts.scss";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await makeRequest.get("/products?limit=100");
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await makeRequest.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <main className="admin_products admin_page">
      <div className="admin_page_header">
        <div>
          <span>Inventory</span>
          <h1>Products</h1>
        </div>
        <Link to="/admin/products/new">Add product</Link>
      </div>

      <section className="admin_panel">
        {loading ? (
          "Loading products..."
        ) : (
          products.map((product) => (
            <div className="admin_product_row" key={product._id}>
              <img src={resolveAssetUrl(product.img)} alt={product.title} />
              <div>
                <strong>{product.title}</strong>
                <span>{product.brand} - {product.category}</span>
              </div>
              <span>${product.price}</span>
              <span>{product.stock} in stock</span>
              <button onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default AdminProducts;
