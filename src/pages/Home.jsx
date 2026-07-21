import "./Home.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/res.jpg";
import storyImage from "../assets/story.jpg";
import reserveImage from "../assets/food.jpg";

function Home() {
 const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/home/")
      .then((response) => response.json())
      .then((data) => {
        setMenu(data.MenuItem);
      })
      .catch((error) => console.error(error));
  }, []);

   const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category_name]) {
      acc[item.category_name] = [];
    }
    acc[item.category_name].push(item);
      return acc;
  }, {});

  return (
    <>
    <section className="hero">
      <div className="hero-content">
  
        <h1>Welcome to Savora</h1>
         <p> Reserve your table for an unforgettable dining experience. </p>

        <Link to="/reservation" className="hero-btn">
          Reserve a Table
        </Link>

        <Link to="/menu" className="hero-button">
          View Menu
        </Link>

      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Restaurant" />
      </div>
    </section>


     <section className="story">
  <div className="story-content">
    <p>OUR STORY</p>

<h2>Cooked over fire, served with warmth.</h2>

  <p>
  At Savora, every meal is crafted with passion and served with care.
  Our chefs combine fresh seasonal ingredients with timeless recipes
  to create dishes that celebrate flavor, tradition, and togetherness.
  Every visit is designed to leave you with unforgettable memories.
</p>


  </div>

  <div className="story-image">
    <img src={storyImage} alt="Our Story" />
  </div>
</section>

<section className="home-menu">
  <p className="menu-subtitle">OUR MENU</p>

  <h2>Favorite Dishes</h2>

  <div className="home-menu-grid">
    {Object.keys(groupedMenu)
      .slice(0, 2) // Show only first 2 categories
      .map((category) => (
        <div key={category} className="menu-category">
          <h3>{category}</h3>

          {groupedMenu[category].map((item) => (
            <div key={item.id} className="menu-item">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))}
        </div>
      ))}
  </div>

  <Link to="/menu" className="menu-btn">
    View Full Menu
  </Link>
</section>

<section className="reservation-home">

  <div className="reservation-form">

    <p className="booking-title">BOOK A TABLE</p>

    <h2>Reserve Your Evening</h2>

    <label>Name</label>
    <input type="text" placeholder="Your Name" />

    <div className="date-time">

      <div>
        <label>Date</label>
        <input type="date" />
      </div>

      <div>
        <label>Time</label>
        <input type="time" />
      </div>

    </div>

    <label>Party Size</label>

    <select>
      <option>2 Guests</option>
      <option>4 Guests</option>
      <option>6 Guests</option>
      <option>8 Guests</option>
    </select>

    <button className="reserve-btn">
      Request Reservation
    </button>

  </div>

  <div className="reservation-image">
    <img src={reserveImage} alt="Reservation" />
  </div>

</section>
    </>
  );
}

export default Home;