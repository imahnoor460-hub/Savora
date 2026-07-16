import { useEffect, useState } from "react";
import "./Menu.css";

export default function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/menu/")
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Category wise group
  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);

    return acc;
  }, {});

  return (
    <div className="menu-page">
      <header className="wrap menu-hero">
        <p className="eyebrow">Dinner</p>
        <h1>The Menu</h1>
        <p className="menu-hero-note">
          Changes with the market. Ask your server about tonight's additions.
        </p>
      </header>

      <div className="wrap menu-body">
        {Object.keys(groupedMenu).map((category) => (
          <section key={category} className="menu-section">
            <div className="menu-section-head">
              <h2>{category}</h2>
            </div>

            <ul className="menu-list">
              {groupedMenu[category].map((item) => (
                <li key={item.id} className="menu-item">
                  <div className="menu-item-head">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>

                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}