import "./Home.css";
import { Link } from "react-router-dom";
import heroImage from "../assets/res.jpg";
import storyImage from "../assets/story.jpg";
import reserveImage from "../assets/food.jpg";

function Home() {
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

  <div className="menu-category">

    <h3>Appetizers</h3>

    <div className="menu-item">
      <span>Tomato Soup</span>
      <span>$8</span>
    </div>

    <div className="menu-item">
      <span>Garlic Bread</span>
      <span>$6</span>
    </div>

    <div className="menu-item">
      <span>Chicken Wings</span>
      <span>$12</span>
    </div>

  </div>

  <div className="menu-category">

    <h3>Main Course</h3>

    <div className="menu-item">
      <span>Grilled Steak</span>
      <span>$28</span>
    </div>

    <div className="menu-item">
      <span>Creamy Pasta</span>
      <span>$18</span>
    </div>

    <div className="menu-item">
      <span>Chicken Alfredo</span>
      <span>$22</span>
    </div>

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