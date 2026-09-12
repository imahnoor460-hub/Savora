import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";
import defaultDishImg from "../assets/food.jpg";
import DishDetailModal from "../components/DishDetailModal";
import { API_BASE } from "../api";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Load menu + categories once, on mount only.
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/menu/`).then((res) => res.json()),
      fetch(`${API_BASE}/category/`).then((res) => res.json()).catch(() => [])
    ])
      .then(([menuData, catData]) => {
        // Handle DRF pagination (.results) or direct arrays for menu
        const items = Array.isArray(menuData)
          ? menuData
          : menuData.results
          ? menuData.results
          : menuData.MenuItem || [];

        setMenu(items);

        // Handle categories data
        const rawCats = Array.isArray(catData)
          ? catData
          : catData.results
          ? catData.results
          : [];

        let catNames = rawCats.map((c) => c.name).filter(Boolean);

        // Fallback if category endpoint is empty
        if (catNames.length === 0) {
          catNames = [...new Set(items.map((item) => item.category_name))].filter(Boolean);
        }

        setCategories(catNames);

        // Pick an initial category only; every later change comes from a click.
        if (catNames.length > 0) {
          const first = catNames[0];
          setActiveCategory(first);
          const firstCatItems = items.filter(
            (item) =>
              String(item.category_name || "").trim().toLowerCase() ===
              String(first).trim().toLowerCase()
          );
          setActiveItem(firstCatItems[0] || null);
        }
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  // Tab labels come from /category/ while items carry category.name, so compare
  // them leniently to survive stray whitespace / casing differences.
  const sameCategory = (item, cat) =>
    String(item.category_name || "").trim().toLowerCase() === String(cat || "").trim().toLowerCase();

  // Filter items based on active category selection
  const filteredItems = menu.filter((item) => sameCategory(item, activeCategory));

  const handleCategorySelect = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    // Switching category also re-points the featured dish and closes any open detail.
    const catItems = menu.filter((item) => sameCategory(item, cat));
    setActiveItem(catItems[0] || null);
    setModalOpen(false);
  };

  const handleDishSelect = (item) => {
    setActiveItem(item);
    setModalOpen(true);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRef.current.style.transform = `perspective(1400px) rotateX(${(-y / (rect.height / 2)) * 6}deg) rotateY(${(x / (rect.width / 2)) * 6}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div style={{ background: "#0C0C0D", color: "#E2E8F0", fontFamily: "'Jost',system-ui,sans-serif", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: ".5", backgroundImage: "radial-gradient(rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }}></div>
      
      {/* Header with dynamic category tabs */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(13,13,15,.72)", backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)", borderBottom: "1px solid rgba(212,175,55,.18)" }}>    
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", maxWidth: "1440px", margin: "0 auto", padding: "16px clamp(18px,4vw,56px)" }}>      
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "13px" }}>        
            <span style={{ width: "32px", height: "32px", display: "grid", placeItems: "center", border: "1px solid rgba(212,175,55,.5)", borderRadius: "50%", fontFamily: "'Cinzel',serif", fontSize: "13px", background: "linear-gradient(140deg,rgba(243,227,178,.18),rgba(140,106,47,.1))", color: "#F3E3B2" }}>S</span>        
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "21px", letterSpacing: ".34em", fontWeight: 600, whiteSpace: "nowrap", backgroundImage: "linear-gradient(100deg,#F6E9C2 0%,#D4AF37 38%,#FFF6DA 52%,#B8862B 70%,#8C6A2F 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>SAVORA</span>      
          </a>      
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.6vw,38px)" }}>        
            <a href="#" style={{ fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#E2E8F0", whiteSpace: "nowrap" }}>Home</a>        
            <a href="#menu" style={{ fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#D4AF37", whiteSpace: "nowrap" }}>Menu</a>        
            <a href="#story" style={{ fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#E2E8F0", whiteSpace: "nowrap" }}>Story</a>        
            <button type="button" onClick={() => navigate("/reservation")} style={{ border: "1px solid rgba(212,175,55,.55)", background: "linear-gradient(120deg,rgba(212,175,55,.16),rgba(212,175,55,.04))", color: "#F3E3B2", fontFamily: "'Jost',sans-serif", fontSize: "11.5px", letterSpacing: ".22em", textTransform: "uppercase", whiteSpace: "nowrap", padding: "12px 24px", borderRadius: "2px", cursor: "pointer" }}>Reserve Table</button>      
          </div>    
        </div>    
        
        {/* Dynamic Category Tabs rendered here */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>      
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", maxWidth: "1440px", margin: "0 auto", padding: "12px clamp(18px,4vw,56px)" }}>        
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button key={cat} type="button" onClick={() => handleCategorySelect(cat)} style={{ border: activeCategory === cat ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,.1)", background: activeCategory === cat ? "rgba(212,175,55,.15)" : "transparent", color: activeCategory === cat ? "#F3E3B2" : "#E2E8F0", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", letterSpacing: ".15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {cat}
                </button>
              ))
            ) : (
              <span style={{ color: "#8a8f98", fontSize: "12px" }}>Loading categories...</span>
            )}
          </div>    
        </div>  
      </header>

      {/* Menu Section */}
      <section id="menu" style={{ position: "relative", padding: "clamp(34px,5vh,62px) clamp(18px,4vw,56px) clamp(70px,9vh,110px)", background: "radial-gradient(90% 50% at 50% 0%, rgba(212,175,55,.07), rgba(12,12,13,0) 60%), linear-gradient(180deg,#0B0B0C,#121214 45%,#0C0C0D)" }}>    
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "22px", marginBottom: "clamp(30px,4vh,52px)" }}>        
            <div>          
              <span style={{ fontSize: "11px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9B27A" }}>SELECTION</span>          
              <h1 style={{ margin: "14px 0 0", fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(34px,4.6vw,60px)", lineHeight: 1.05, backgroundImage: "linear-gradient(100deg,#F6E9C2,#D4AF37 40%,#FFF6DA 52%,#8C6A2F)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {activeCategory || "Menu"}
              </h1>        
            </div>        
            <p style={{ margin: 0, maxWidth: "320px", fontSize: "14px", lineHeight: 1.8, color: "#8A8F98", fontWeight: 300 }}>Hover any dish to plate it. Select one for the full tasting detail.</p>      
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignitems: "flex-start", gap: "clamp(28px,3.4vw,64px)" }}>
            <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>          
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button 
                    key={item.id} 
                    type="button" 
                    onMouseEnter={() => setActiveItem(item)}
                    onFocus={() => setActiveItem(item)}
                    onClick={() => handleDishSelect(item)}
                    style={{ background: activeItem?.id === item.id ? "rgba(25, 25, 25, 0.9)" : "rgba(20, 20, 20, 0.6)", border: "1px solid", borderColor: activeItem?.id === item.id ? "rgba(212, 175, 55, 0.4)" : "rgba(255, 255, 255, 0.06)", borderRadius: "6px", padding: "24px", textAlign: "left", cursor: "pointer", width: "100%" }}
                  >              
                    <span style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>                
                      <span style={{ flex: "0 1 auto", fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", lineHeight: 1.2, color: "#F4F1EA" }}>{item.name}</span>                
                      <span style={{ flex: "1 1 auto", minWidth: "22px", height: "1px", borderBottom: "1px dotted rgba(212,175,55,.55)" }}></span>                
                      <span style={{ flex: "0 0 auto", fontFamily: "'Cinzel',serif", fontSize: "15px", color: "#D4AF37", whiteSpace: "nowrap" }}>
                        ${Number(item.price || 0).toFixed(2)}
                      </span>              
                    </span>              
                    <span style={{ display: "block", marginTop: "7px", fontSize: "13px", lineHeight: 1.65, color: "#8A8F98", fontStyle: "italic", fontWeight: 300 }}>{item.description}</span>              
                    <span style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "9px", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "#6E7480" }}>                
                      {item.energy && <span>{item.energy}</span>}
                      {item.allergens && <span>{item.allergens}</span>}
                      {item.is_chef_recommendation && (
                        <span style={{ color: "#D4AF37", fontWeight: 600 }}>★ Chef's Recommendation</span>
                      )}
                    </span>
                  </button>
                ))
              ) : (
                <p style={{ color: "#8a8f98", padding: "20px 0" }}>No dishes available in this category.</p>
              )}
            </div>

            {/* Right Sticky Showcase Card */}
            <div style={{ flex: "0 1 360px", minWidth: "290px", position: "sticky", top: "150px", display: "flex", flexDirection: "column", alignItems: "center", perspective: "1400px" }}>          
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ position: "relative", width: "100%", padding: "clamp(24px,2.6vw,36px)", borderRadius: "8px", transformStyle: "preserve-3d", transition: "transform .5s cubic-bezier(.2,.7,.2,1)", background: "linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.012) 45%, rgba(212,175,55,.04))", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: "1px solid rgba(212,175,55,.22)", boxShadow: "0 60px 120px -50px rgba(0,0,0,.95), inset 0 1px 0 rgba(255,255,255,.07)" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between", transform: "translateZ(28px)" }}>              
                  <span style={{ fontSize: "10px", letterSpacing: ".34em", textTransform: "uppercase", color: "#C9B27A" }}>Now plating</span>              
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: ".2em", color: "rgba(212,175,55,.6)" }}>№ {activeItem?.id ? String(activeItem.id).padStart(2, '0') : "04"}</span>            
                </div>
                
                <div style={{ position: "relative", width: "100%", aspectRatio: 1, margin: "20px 0 6px", transform: "translateZ(54px)", transformStyle: "preserve-3d" }}>              
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(65% 65% at 36% 30%, #26262B, #0E0E10 72%)", boxShadow: "0 0 30px rgba(212,175,55,.2), 0 60px 90px -40px rgba(0,0,0,.95), 0 0 0 1px rgba(212,175,55,.35), inset 0 0 60px rgba(0,0,0,.8)" }}></div>              
                  <img alt={activeItem?.name || "Dish"} src={activeItem?.image || defaultDishImg} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", position: "relative", zIndex: 2 }} />              
                </div>

                <div style={{ transform: "translateZ(30px)" }}>              
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", color: "#F4F1EA", lineHeight: 1.2 }}>{activeItem?.name || "Select a dish"}</div>              
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "6px" }}>                
                    <span style={{ flex: "1 1 auto", height: "1px", borderBottom: "1px dotted rgba(212,175,55,.55)" }}></span>                
                    <span style={{ flex: "0 0 auto", fontFamily: "'Cinzel',serif", fontSize: "16px", color: "#D4AF37", whiteSpace: "nowrap" }}>
                      {activeItem?.price ? `$${Number(activeItem.price).toFixed(2)}` : "$0.00"}
                    </span>              
                  </div>              
                  <p style={{ margin: "10px 0 0", fontSize: "13px", lineHeight: 1.65, color: "#8A8F98", fontStyle: "italic", fontWeight: 300 }}>{activeItem?.description || "Exquisite preparation featuring seasonal components."}</p>
                  
                  {(activeItem?.energy || activeItem?.allergens) && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                      {activeItem?.energy && (
                        <div style={{ flex: "1 1 0", minWidth: 0, padding: "11px 13px", borderRadius: "4px", border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)" }}>
                          <div style={{ fontSize: "9px", letterSpacing: ".26em", textTransform: "uppercase", color: "#6E7480" }}>Energy</div>
                          <div style={{ marginTop: "5px", fontSize: "13px", color: "#E2E8F0" }}>{activeItem.energy}</div>
                        </div>
                      )}
                      {activeItem?.allergens && (
                        <div style={{ flex: "1 1 0", minWidth: 0, padding: "11px 13px", borderRadius: "4px", border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)" }}>
                          <div style={{ fontSize: "9px", letterSpacing: ".26em", textTransform: "uppercase", color: "#6E7480" }}>Allergens</div>
                          <div style={{ marginTop: "5px", fontSize: "13px", color: "#E2E8F0" }}>{activeItem.allergens}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <button type="button" onClick={() => navigate("/reservation")} style={{ width: "100%", marginTop: "18px", border: "1px solid rgba(212,175,55,.5)", background: "linear-gradient(120deg,rgba(212,175,55,.16),rgba(212,175,55,.04))", color: "#F3E3B2", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: ".24em", textTransform: "uppercase", whiteSpace: "nowrap", padding: "14px 20px", borderRadius: "2px", cursor: "pointer" }}>Reserve Table</button>            
                </div>          
              </div>        
            </div>      
          </div>    
        </div>
      </section>

      {/* Same tasting detail popup the Home page uses */}
      <DishDetailModal
        item={activeItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fallbackImage={defaultDishImg}
      />
    </div>
  );
}