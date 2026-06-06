import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";
import "./AdminProductForm.scss";

const categories = ["laptops", "phones", "audio", "gaming", "accessories"];
const types = ["featured", "trending", "new", "sale"];

const AdminProductForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    desc: "",
    brand: "",
    category: "laptops",
    subCategory: "",
    type: "featured",
    price: "",
    oldPrice: "",
    stock: "",
    isNewProduct: false,
  });
  const [specRows, setSpecRows] = useState([
    { key: "Memory", value: "" },
    { key: "Storage", value: "" },
  ]);
  const [images, setImages] = useState({ img: null, img2: null });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onFileChange = (e) => {
    const { name, files } = e.target;
    setImages((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const updateSpecRow = (index, field, value) => {
    setSpecRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addSpecRow = () => {
    setSpecRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecRow = (index) => {
    setSpecRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const buildSpecs = () =>
    specRows.reduce((specs, row) => {
      const key = row.key.trim();
      const value = row.value.trim();
      if (key && value) specs[key] = value;
      return specs;
    }, {});

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });
      payload.append("specs", JSON.stringify(buildSpecs()));
      if (images.img) payload.append("img", images.img);
      if (images.img2) payload.append("img2", images.img2);

      await makeRequest.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created.");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Could not create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin_product_form admin_page">
      <div className="admin_page_header">
        <div>
          <span>Inventory</span>
          <h1>Add product</h1>
        </div>
      </div>

      <form className="admin_panel" onSubmit={onSubmit}>
        <input name="title" value={form.title} onChange={onChange} placeholder="Product title" required />
        <textarea name="desc" value={form.desc} onChange={onChange} placeholder="Description" required />
        <input name="brand" value={form.brand} onChange={onChange} placeholder="Brand" required />
        <div className="admin_form_grid">
          <select name="category" value={form.category} onChange={onChange}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <input name="subCategory" value={form.subCategory} onChange={onChange} placeholder="Sub-category" />
          <select name="type" value={form.type} onChange={onChange}>{types.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="admin_form_grid">
          <input name="price" value={form.price} onChange={onChange} type="number" min="0" placeholder="Price" required />
          <input name="oldPrice" value={form.oldPrice} onChange={onChange} type="number" min="0" placeholder="Old price" />
          <input name="stock" value={form.stock} onChange={onChange} type="number" min="0" placeholder="Stock" />
        </div>
        <label className="admin_file_input">
          Primary image
          <input name="img" onChange={onFileChange} type="file" accept="image/*" required />
          {images.img && <span>{images.img.name}</span>}
        </label>
        <label className="admin_file_input">
          Secondary image
          <input name="img2" onChange={onFileChange} type="file" accept="image/*" />
          {images.img2 && <span>{images.img2.name}</span>}
        </label>
        <div className="admin_specs">
          <div className="admin_specs_header">
            <span>Specifications</span>
            <button type="button" onClick={addSpecRow}>Add spec</button>
          </div>
          {specRows.map((row, index) => (
            <div className="admin_spec_row" key={index}>
              <input
                value={row.key}
                onChange={(e) => updateSpecRow(index, "key", e.target.value)}
                placeholder="Spec name"
              />
              <input
                value={row.value}
                onChange={(e) => updateSpecRow(index, "value", e.target.value)}
                placeholder="Spec value"
              />
              <button type="button" onClick={() => removeSpecRow(index)} disabled={specRows.length === 1}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <label className="admin_checkbox">
          <input name="isNewProduct" checked={form.isNewProduct} onChange={onChange} type="checkbox" />
          Mark as new
        </label>
        <button disabled={loading}>{loading ? "Saving..." : "Create product"}</button>
      </form>
    </main>
  );
};

export default AdminProductForm;
