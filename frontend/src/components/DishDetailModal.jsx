import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DishDetailModal.css";
import defaultDishImg from "../assets/food.jpg";

/**
 * Shared tasting-detail popup used by both the Home page and the Menu page.
 * Renders whatever the Django API actually returns for the dish; the decorative
 * Composition / Pairing copy falls back to the original static text only when
 * the API has no such field.
 */
export default function DishDetailModal({ item, open, onClose, fallbackImage }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Reset the 360 spin whenever a different dish is opened.
  useEffect(() => {
    if (open) setRotation(0);
  }, [open, item?.id]);

  // Close on Escape, and stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const handleSpinDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };

  const handleSpinMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setRotation((prev) => prev + (currentX - startX) * 0.8);
    setStartX(currentX);
  };

  const handleSpinUp = () => setIsDragging(false);

  const price = Number(item.price);
  const priceLabel = Number.isFinite(price) ? `$${price.toFixed(2)}` : "$--";

  // Composition arrives as one string holding several ingredients. The admin
  // textarea takes them one per line, which is what every dish currently uses,
  // and the field's help text asks for commas — so accept either, plus the
  // semicolons people reach for anyway. Splitting on commas alone left the
  // whole string in a single chip, which is why it rendered as one long line.
  const composition = String(item.composition || "")
    .split(/[\r\n,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const energy = String(item.energy || "").trim();
  const allergens = String(item.allergens || "").trim();
  const pairing = String(item.pairing || "").trim();
  const hasMeta = energy || allergens || pairing;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={item.name || "Dish detail"}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-360-col">
          <div
            className="interactive-360-container"
            onMouseDown={handleSpinDown}
            onMouseMove={handleSpinMove}
            onMouseUp={handleSpinUp}
            onMouseLeave={handleSpinUp}
            onTouchStart={handleSpinDown}
            onTouchMove={handleSpinMove}
            onTouchEnd={handleSpinUp}
          >
            <div className="plate-360-shadow"></div>
            <div className="spin-image-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
              <img
                src={item.image || fallbackImage || defaultDishImg}
                alt={item.name || "Plated dish"}
                className="spin-image"
              />
            </div>
            <div className="plate-360-ring"></div>
          </div>
          <span className="drag-hint">Drag to rotate</span>
        </div>

        <div className="modal-info-col">
          <div className="modal-cat-tag">{item.category_name || "Specialty"}</div>
          <h3 className="modal-title">{item.name || "Signature Dish"}</h3>
          <div className="modal-price-line">
            <span className="modal-dots"></span>
            <span className="modal-price">{priceLabel}</span>
          </div>
          <p className="modal-description">
            {item.description ||
              item.note ||
              "Prepared over open embers using rare artisanal technique and gold leaf touches."}
          </p>

          {item.is_chef_recommendation && (
            <div className="modal-chef-badge">
              {/* Not `.star-icon`: Home.css styles that class as a filled gold disc. */}
              <span className="chef-star">★</span>
              <span>Chef&apos;s Recommendation</span>
            </div>
          )}

          {/* Every section below is optional: blank fields are simply not shown. */}
          {composition.length > 0 && (
            <>
              <div className="modal-section-title">Composition</div>
              <div className="modal-ingredients">
                {composition.map((ing, index) => (
                  <span key={`${ing}-${index}`} className="ingredient-chip">
                    {ing}
                  </span>
                ))}
              </div>
            </>
          )}

          {hasMeta && (
            <div className="modal-meta-grid">
              {energy && (
                <div>
                  <div className="meta-label">Energy</div>
                  <div className="meta-value">{energy}</div>
                </div>
              )}
              {allergens && (
                <div>
                  <div className="meta-label">Allergens</div>
                  <div className="meta-value">{allergens}</div>
                </div>
              )}
              {pairing && (
                <div>
                  <div className="meta-label">Pairing</div>
                  <div className="meta-value">{pairing}</div>
                </div>
              )}
            </div>
          )}

          <Link to="/reservation" className="btn-gold-primary full-width">
            Add to Reservation
          </Link>
        </div>
      </div>
    </div>
  );
}
