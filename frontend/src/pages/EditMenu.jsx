import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddMenu.css";
import { API_BASE, apiFetch, getErrorMessage } from "../api";
import MenuImageField from "../components/MenuImageField";

export default function EditMenu() {
  const { id } = useParams();
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

  // Image saved against the item, plus any pending replace / remove.
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageCleared, setImageCleared] = useState(false);

  useEffect(() => {
    fetchMenuItem();
    fetchCategories();
  }, []);

  const fetchMenuItem = async () => {
    try {
      const response = await fetch(`${API_BASE}/menu/${id}/`);
      const data = await response.json();

      // Older items have no tasting detail yet, so fall back to empty strings
      // rather than letting the inputs go uncontrolled.
      setFormData({
        name: data.name ?? "",
        description: data.description ?? "",
        price: data.price ?? "",
        category: data.category ?? "",
        composition: data.composition ?? "",
        energy: data.energy ?? "",
        allergens: data.allergens ?? "",
        pairing: data.pairing ?? "",
        is_chef_recommendation: Boolean(data.is_chef_recommendation),
      });

      setCurrentImageUrl(data.image || "");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category/`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (imageFile) {
      // New file replaces whatever was there.
      payload.append("image", imageFile);
    } else if (imageCleared) {
      // Empty value tells DRF to null the field out.
      payload.append("image", "");
    }
    // Neither: the field is left out entirely, so the saved image is kept.

    try {
      const response = await apiFetch(`/menu/${id}/`, {
        method: "PUT",
        body: payload,
      });

      if (response.ok) {
        alert("Menu Updated Successfully");
        navigate("/admin");
        return;
      }

      // Show what the server actually rejected rather than a blanket failure.
      const message = await getErrorMessage(response);
      console.error("Menu update failed:", response.status, message);
      alert(`Update failed\n\n${message}`);

      if (response.status === 401) navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Menu Item</h1>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
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
          currentImageUrl={currentImageUrl}
          file={imageFile}
          cleared={imageCleared}
          onFileChange={(f) => {
            setImageFile(f);
            setImageCleared(false);
          }}
          onClear={() => {
            setImageFile(null);
            setImageCleared(true);
          }}
        />

        <button type="submit">
          Update Menu
        </button>
      </form>
    </div>
  );
}