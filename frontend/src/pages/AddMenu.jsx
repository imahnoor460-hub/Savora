import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMenu.css";
import { API_BASE, apiFetch, getErrorMessage } from "../api";
import MenuImageField from "../components/MenuImageField";

export default function AddMenu() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    composition: "",
    energy: "",
    allergens: "",
    pairing: "",
    is_chef_recommendation: false,
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/category/`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // multipart, so the photo can travel with the rest of the fields.
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (imageFile) payload.append("image", imageFile);

    try {
      const response = await apiFetch("/menu/", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        alert("Menu Added Successfully");
        navigate("/admin");
        return;
      }

      const message = await getErrorMessage(response);
      console.error("Menu create failed:", response.status, message);
      alert(`Could not add menu item\n\n${message}`);

      if (response.status === 401) navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="form-container">
      <h1>Add Menu Item</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label htmlFor="composition">Composition</label>
        <textarea
          id="composition"
          name="composition"
          placeholder="Native lobster, La Mancha saffron, Fennel pollen, Brown butter, Bisque"
          value={formData.composition}
          onChange={handleChange}
        />

        <label htmlFor="energy">Energy</label>
        <input
          id="energy"
          name="energy"
          type="text"
          placeholder="640 kcal"
          value={formData.energy}
          onChange={handleChange}
        />

        <label htmlFor="allergens">Allergens</label>
        <input
          id="allergens"
          name="allergens"
          type="text"
          placeholder="Crustaceans, Dairy"
          value={formData.allergens}
          onChange={handleChange}
        />

        <label htmlFor="pairing">Pairing</label>
        <input
          id="pairing"
          name="pairing"
          type="text"
          placeholder="Barolo 2009"
          value={formData.pairing}
          onChange={handleChange}
        />

        <label className="checkbox-row" htmlFor="is_chef_recommendation">
          <input
            id="is_chef_recommendation"
            name="is_chef_recommendation"
            type="checkbox"
            checked={formData.is_chef_recommendation}
            onChange={handleChange}
          />
          Chef&apos;s Recommendation
        </label>

        <MenuImageField
          file={imageFile}
          onFileChange={setImageFile}
          onClear={() => setImageFile(null)}
        />

        <button type="submit">
          Save
        </button>
      </form>
    </div>
  );
}