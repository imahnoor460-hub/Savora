import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>Savora</h2>
          <p>
            Experience delicious food and reserve your table for an unforgettable dining experience.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <p><Link to="/">Home</Link></p>
          <p><Link to="/menu">Menu</Link></p>
          <p><Link to="/about">About</Link></p>
          <p><Link to="/reservation">Reservation</Link></p>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>📍 Lahore, Pakistan</p>
          <p>📞 +92 300 1234567</p>
          <p>✉️ info@savora.com</p>
        </div>

<div className="footer-hours">
  <h3>Opening Hours</h3>

  <p>Monday - Friday: 11:00 AM – 10:00 PM</p>
  <p>Saturday: 12:00 PM – 11:00 PM</p>
  <p>Sunday: 12:00 PM – 9:00 PM</p>
</div>
</div>
      <div className="copyright">
        © {new Date().getFullYear()} Savora. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;