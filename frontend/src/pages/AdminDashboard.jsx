import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/menu/");

      if (!response.ok) {
        console.error("Failed to fetch menu:", response.status);
        return;
      }

      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/menu/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Menu item deleted successfully!");
        fetchMenu();
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
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
            <h3>{item.name}</h3>

            <p className="price">${item.price}</p>

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