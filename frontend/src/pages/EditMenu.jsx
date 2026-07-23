import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddMenu.css";

export default function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchMenuItem();
    fetchCategories();
  }, []);

  const fetchMenuItem = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/menu/${id}/`);
      const data = await response.json();

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/category/");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/menu/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Menu Updated Successfully");
        navigate("/admin");
      } else {
        alert("Update Failed");
      }
    } catch (error) {
      console.log(error);
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

        <button type="submit">
          Update Menu
        </button>
      </form>
    </div>
  );
}