import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import DishDetailModal from "../components/DishDetailModal";

import heroImage from "../assets/res.jpg";
import storyImage from "../assets/story.jpg";
import reserveImage from "../assets/food.jpg";

// Which menu item the hero card shows, matched loosely against the dish name.
const HERO_DISH_MATCH = "wagyu";

function Home() {
  const [menu, setMenu] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Parallax / Tilt Refs
  const heroRef = useRef(null);
  const heroCardRef = useRef(null);
  const storyCardRef = useRef(null);
  const showcaseCardRef = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/home/")
      .then((response) => response.json())
      .then((data) => {
        const fetchedItems = data.MenuItem || [];
        setMenu(fetchedItems);
        if (fetchedItems.length > 0) {
          setActiveItem(fetchedItems[0]);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // The hero card is pinned to the Wagyu dish. Change HERO_DISH_MATCH to point
  // it at something else; if no dish matches it falls back to the first
  // Chef's Recommendation, and then to the static artwork below.
  const heroDish =
    menu.find((item) =>
      String(item.name || "").toLowerCase().includes(HERO_DISH_MATCH)
    ) ||
    menu.find((item) => item.is_chef_recommendation) ||
    null;

  // The card's sub-line is a short uppercase phrase, so use only the first
  // clause of the description rather than the whole sentence.
  const heroSub = heroDish?.description
    ? heroDish.description.split(",")[0].replace(/\.$/, "").trim()
    : "Bone marrow jus";

  // Menu Items Grouping Logic (Frontend-Only, Handles Category IDs & Strings)
  const groupedMenu = menu.reduce((acc, item) => {
    let catKey = "Specialties";

    if (item.category_name) {
      catKey = item.category_name;
    } else if (typeof item.category === "object" && item.category?.name) {
      catKey = item.category.name;
    } else if (item.category) {
      catKey = `Category ${item.category}`;
    }

    if (!acc[catKey]) {
      acc[catKey] = [];
    }
    acc[catKey].push(item);
    return acc;
  }, {});

  // Parallax Handlers
  const handleParallax = (e) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (clientY - innerHeight / 2) / (innerHeight / 2);

    const elements = heroRef.current.querySelectorAll("[data-depth]");
    elements.forEach((el) => {
      const depth = parseFloat(el.getAttribute("data-depth")) || 10;
      const moveX = x * depth;
      const moveY = y * depth;
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  };

  const resetParallax = () => {
    if (!heroRef.current) return;
    const elements = heroRef.current.querySelectorAll("[data-depth]");
    elements.forEach((el) => {
      el.style.transform = "translate3d(0, 0, 0)";
    });
  };

  // 3D Tilt Handlers
  const handleTilt = (e, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = (ref) => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const numerals = ["I", "II", "III", "IV", "V", "VI"];

  return (
    <div className="savora-wrapper">
      {/* HERO SECTION */}
      <section
        id="top"
        ref={heroRef}
        onMouseMove={handleParallax}
        onMouseLeave={resetParallax}
        className="savora-hero-section"
      >
        <div data-depth="7" className="hero-glow-1"></div>
        <div data-depth="4" className="hero-pattern"></div>

        <div className="hero-container">
          <div data-depth="14" className="hero-text-block">
            <div className="hero-badge">
              <span className="badge-line"></span>
              <span className="badge-text">Est. 2011 · Two Michelin Stars</span>
            </div>
            <h1 className="hero-title">
              <span className="title-plain">Savor the</span>
              <span className="title-gradient">Extraordinary</span>
            </h1>
            <p className="hero-description">
              A Twenty-eight-course odyssey of fire, patience and gold. Chef Elio Marchetti composes each seating for eighteen guests — once per evening, never repeated.
            </p>
            <div className="hero-actions">
              <Link to="/reservation" className="btn-gold-primary">
                Reserve a Table
              </Link>
              <a href="#menu" className="btn-outline-light">
                Explore the Menu
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-number">28</div>
                <div className="stat-label">Courses</div>
              </div>
              <div>
                <div className="stat-number">18</div>
                <div className="stat-label">Seats Nightly</div>
              </div>
              <div>
                <div className="stat-number">1</div>
                <div className="stat-label">Seating</div>
              </div>
            </div>
          </div>

          <div data-depth="26" className="hero-card-wrapper">
            <div
              ref={heroCardRef}
              onMouseMove={(e) => handleTilt(e, heroCardRef)}
              onMouseLeave={() => resetTilt(heroCardRef)}
              className="hero-3d-card"
            >
              <div className="card-shine"></div>
              <div className="card-header">
                <span className="tag-gold">Signature</span>
                <span className="no-gold">№ 07</span>
              </div>
              <div className="card-dish-image-container">
                <img
                  src={heroDish?.image || heroImage}
                  alt={heroDish?.name || "Wagyu & Gold Leaf"}
                  className="card-dish-image"
                />
              </div>
              <div className="card-orbit-ring">
                <span className="orbit-dot"></span>
              </div>
              <div className="card-footer">
                <div className="dish-title">{heroDish?.name || "Wagyu & Gold Leaf"}</div>
                <div className="dish-details">
                  <span className="dish-sub">{heroSub}</span>
                  <span className="dish-dots"></span>
                  <span className="dish-price">
                    {heroDish ? `$${Number(heroDish.price).toFixed(2)}` : "$145"}
                  </span>
                </div>
              </div>
            </div>

            <div data-depth="46" className="float-badge-top">
              <span className="star-icon">★</span>
              <span className="badge-label">Chef's Recommendation</span>
            </div>
            <div data-depth="38" className="float-badge-bottom">
              <div className="float-time">Tonight</div>
              <div className="float-status">3 seats remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="savora-menu-section">
        <div className="menu-container">
          <div className="menu-header">
            <div>
              <span className="menu-subtitle-gold">The Carte</span>
              <h2 className="menu-title">Featured Menu</h2>
            </div>
            <p className="menu-instruction">
              Hover over a dish to view it. Select one to open the tasting detail.
            </p>
          </div>

          <div className="menu-grid">
            {/* Left Column: Limited to 3 Categories and 3 Products each */}
            <div className="menu-categories-column">
              {Object.keys(groupedMenu).length > 0 ? (
                Object.keys(groupedMenu)
                  .slice(0, 3) // Sirf pehli 3 Categories
                  .map((category, idx) => (
                    <div key={category} className="menu-category-group">
                      <div className="category-header">
                        <span className="cat-numeral">{numerals[idx % numerals.length]}</span>
                        <h3 className="cat-name">{category}</h3>
                        <span className="cat-line"></span>
                        <span className="cat-pairing">Wine Pairing Available</span>
                      </div>
                      <div className="category-items">
                        {groupedMenu[category]
                          .slice(0, 3) // Har Category ke pehle 3 Products
                          .map((item) => (
                            <button
                              key={item.id || item.name}
                              type="button"
                              className={`menu-item-row ${activeItem?.name === item.name ? "active-row" : ""}`}
                              onMouseEnter={() => setActiveItem(item)}
                              onFocus={() => setActiveItem(item)}
                              onClick={() => {
                                setActiveItem(item);
                                setModalOpen(true);
                              }}
                            >
                              <span className="item-title-line">
                                <span className="item-name">{item.name}</span>
                                <span className="item-dots"></span>
                                <span className="item-price">${item.price}</span>
                              </span>
                              <span className="item-note">
                                {item.description || item.note || "Hand-harvested ingredients cooked over oak fire."}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))
              ) : (
                /* Fallback: Direct list view for ungrouped API response */
                <div className="menu-category-group">
                  <div className="category-header">
                    <span className="cat-numeral">I</span>
                    <h3 className="cat-name">Chef Specialties</h3>
                    <span className="cat-line"></span>
                  </div>
                  <div className="category-items">
                    {menu.slice(0, 3).map((item) => (
                      <button
                        key={item.id || item.name}
                        type="button"
                        className={`menu-item-row ${activeItem?.name === item.name ? "active-row" : ""}`}
                        onMouseEnter={() => setActiveItem(item)}
                        onFocus={() => setActiveItem(item)}
                        onClick={() => {
                          setActiveItem(item);
                          setModalOpen(true);
                        }}
                      >
                        <span className="item-title-line">
                          <span className="item-name">{item.name}</span>
                          <span className="item-dots"></span>
                          <span className="item-price">${item.price}</span>
                        </span>
                        <span className="item-note">
                          {item.description || "Hand-harvested ingredients cooked over oak fire."}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Plating Showcase */}
            <div className="menu-showcase-column">
              <div
                ref={showcaseCardRef}
                onMouseMove={(e) => handleTilt(e, showcaseCardRef)}
                onMouseLeave={() => resetTilt(showcaseCardRef)}
                className="showcase-card"
              >
                <div className="showcase-header">
                  <span className="tag-gold">Now plating</span>
                  <span className="no-gold">№ {activeItem?.id || "01"}</span>
                </div>

                <div className="showcase-plate-container">
                  <div className="plate-background"></div>
                  <div className="plate-image-wrapper">
                    <img
                      src={activeItem?.image || reserveImage}
                      alt={activeItem?.name || "Plated Dish"}
                      className="plate-image"
                    />
                  </div>
                  <div className="plate-orbit">
                    <span className="orbit-dot"></span>
                  </div>
                </div>

                <div className="showcase-info">
                  <div className="showcase-title-line">
                    <span className="showcase-name">{activeItem?.name || "Select a dish"}</span>
                    <span className="showcase-dots"></span>
                    <span className="showcase-price">${activeItem?.price || "--"}</span>
                  </div>
                  <p className="showcase-note">
                    {activeItem?.description || activeItem?.note || "A symphony of taste crafted specifically for this evening's seating."}
                  </p>
                </div>
              </div>

              {activeItem?.is_chef_recommendation && (
                <div className="showcase-recommendation-badge">
                  <span className="star-icon">★</span>
                  <span className="badge-label">Chef's Recommendation</span>
                </div>
              )}
            </div>
          </div>

          {/* VIEW FULL MENU BUTTON */}
          <div className="view-full-menu-container" style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <Link to="/menu" className="btn-gold-primary">
              View Full Menu
            </Link>
          </div>
        </div>

        {/* TASTING DETAIL MODAL (shared with the Menu page) */}
        <DishDetailModal
          item={activeItem}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fallbackImage={reserveImage}
        />
      </section>

      {/* STORY SECTION */}
      <section id="story" className="savora-story-section">
        <div className="story-container">
          <div
            ref={storyCardRef}
            onMouseMove={(e) => handleTilt(e, storyCardRef)}
            onMouseLeave={() => resetTilt(storyCardRef)}
            className="story-image-card"
          >
            <img src={storyImage} alt="Savora Dining Room" className="story-img" />
          </div>

          <div className="story-text-block">
            <span className="story-subtitle">The Story</span>
            <h2 className="story-title">
              Eighteen chairs, <span className="title-gradient">one fire</span>
            </h2>
            <p className="story-paragraph">
              Savora began as a six-seat counter above a Mayfair wine cellar. The counter is still here — larger, darker, lit by a single seam of brass — and the hearth still burns oak from the same Suffolk grove.
            </p>
            <p className="story-paragraph">
              There is no à la carte. There is only the evening, and what the morning boats and the kitchen garden decided it should be.
            </p>
            <div className="story-chef">Elio Marchetti</div>
            <div className="story-chef-title">Chef Patron</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;