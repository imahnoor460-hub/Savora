import { menu } from "../data/menu";
import "./Menu.css";

export default function Menu() {
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
        {menu.map((section) => (
          <section key={section.category} className="menu-section">
            <div className="menu-section-head">
              <h2>{section.category}</h2>
              <p>{section.note}</p>
            </div>

            <ul className="menu-list">
              {section.items.map((item) => (
                <li key={item.name} className="menu-item">
                  <div className="menu-item-head">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>

                  <p>{item.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}