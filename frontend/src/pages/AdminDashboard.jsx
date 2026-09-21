import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { API_BASE, apiFetch, getErrorMessage } from "../api";
import { formatPrice } from "../formatPrice";

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_BASE}/menu/`);

      if (!response.ok) {
        console.error("Failed to fetch menu:", response.status);
        return;
      }

      const data = await response.json();
      setMenu(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/menu/${id}/`, { method: "DELETE" });

      if (response.ok) {
        alert("Menu item deleted successfully!");
        fetchMenu();
        return;
      }

      const message = await getErrorMessage(response);
      console.error("Menu delete failed:", response.status, message);
      alert(`Delete failed\n\n${message}`);

      if (response.status === 401) navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>

        <button
          className="add-btn"
          onClick={() => navigate("/admin/add")}
        >
          + Add Menu Item
        </button>
      </div>

      <div className="menu-grid">
        {menu.map((item) => (
          <div className="menu-card" key={item.id}>
            {item.image && (
              <img className="card-thumb" src={item.image} alt={item.name} />
            )}

            <h3>{item.name}</h3>

            <p className="price">{formatPrice(item.price)}</p>

            <div className="card-buttons">
              <button
                className="edit-btn"
                onClick={() => navigate(`/admin/edit/${item.id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}