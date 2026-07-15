import "./Reservation.css";
import reserveImage from "../assets/food.jpg";

export default function Reservation() {
  return (
    <section className="reservation-page">

      {/* Left Side */}
      <div className="reservation-form">

        <p className="reservation-subtitle">
          BOOK A TABLE
        </p>

        <h1>Reserve Your Table</h1>

        <p className="reservation-text">
          Enjoy an unforgettable dining experience at Savora.
          Reserve your table in advance and let us prepare the
          perfect evening for you and your guests.
        </p>

        <form>

          <div className="input-row">

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your Name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email Address"
              />
            </div>

          </div>

          <div className="input-row">

            <div className="input-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
              />
            </div>

            <div className="input-group">
              <label>Guests</label>

              <select>
                <option>2 Guests</option>
                <option>4 Guests</option>
                <option>6 Guests</option>
                <option>8 Guests</option>
              </select>

            </div>

          </div>

          <div className="input-row">

            <div className="input-group">
              <label>Date</label>
              <input type="date" />
            </div>

            <div className="input-group">
              <label>Time</label>
              <input type="time" />
            </div>

          </div>

          <div className="input-group">

            <label>Special Request</label>

            <textarea
              rows="4"
              placeholder="Write your special request..."
            ></textarea>

          </div>

          <button className="reservation-btn">
            Reserve Now
          </button>

        </form>

      </div>

      {/* Right Side */}

      <div className="reservation-image">
        <img
          src={reserveImage}
          alt="Restaurant"
        />
      </div>

    </section>
  );
}