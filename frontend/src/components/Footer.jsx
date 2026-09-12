import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Brand & Address */}
        <div className="footer-column">
          <div className="footer-brand">SAVORA</div>
          <p className="footer-address">
            12 Aurelia Court, Mayfair
            <br />
            London W1K 4QJ
          </p>
        </div>

        {/* Hours */}
        <div className="footer-column">
          <div className="footer-heading">Hours</div>
          <div className="hours-list">
            <div className="hours-row">
              <span className="day">Tue — Thu</span>
              <span className="dot-filler"></span>
              <span className="time">18:00 — 23:00</span>
            </div>
            <div className="hours-row">
              <span className="day">Fri — Sat</span>
              <span className="dot-filler"></span>
              <span className="time">18:00 — 01:00</span>
            </div>
            <div className="hours-row">
              <span className="day">Sunday</span>
              <span className="dot-filler"></span>
              <span className="time">13:00 — 16:00</span>
            </div>
            <div className="hours-row">
              <span className="day">Monday</span>
              <span className="dot-filler"></span>
              <span className="time closed">Closed</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <div className="footer-heading">Contact</div>
          <div className="contact-list">
            <a href="tel:+442079460918" className="footer-link">
              +44 20 7946 0918
            </a>
            <a href="mailto:reserve@savora.com" className="footer-link">
              reserve@savora.com
            </a>
            <span className="subtext">Enquiries answered within 24h</span>
          </div>
        </div>

        {/* Reservations */}
        <div className="footer-column">
          <div className="footer-heading">Reservations</div>
          <p className="footer-text">
            Bookings open on the first of each month, 09:00 GMT.
          </p>
          <Link to="/reservation">
            <button type="button" className="btn-join-list">
              Join the List
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <span>© 2026 Savora Restaurant</span>
        <span>Mayfair · London</span>
      </div>
    </footer>
  );
}

export default Footer;