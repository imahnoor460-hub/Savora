import { useState } from "react";
import "./Reservation.css";
import reserveImage from "../assets/food.jpg";

export default function Reservation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [special_request, setSpecialRequest] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/reservation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          guests,
          date,
          time,
          special_request,
        }),
      });

      if (response.ok) {
        alert("Reservation submitted successfully!");

        // Form clear
        setName("");
        setEmail("");
        setPhone("");
        setGuests("2");
        setDate("");
        setTime("");
        setSpecialRequest("");
      } else {
        const error = await response.json();
        console.log(error);
        alert("Failed to submit reservation.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    }
  };

  return (
    <section className="reservation-page">
      <div className="reservation-form">
        <p className="reservation-subtitle">BOOK A TABLE</p>

        <h1>Reserve Your Table</h1>

        <p className="reservation-text">
          Enjoy an unforgettable dining experience at Savora.
          Reserve your table in advance and let us prepare the
          perfect evening for you and your guests.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-row">

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          <div className="input-row">

            <div className="input-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Guests</label>

              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8">8 Guests</option>
              </select>

            </div>

          </div>

          <div className="input-row">

            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

          </div>

          <div className="input-group">

            <label>Special Request</label>

            <textarea
              rows="4"
              placeholder="Write your special request..."
              value={special_request}
              onChange={(e) => setSpecialRequest(e.target.value)}
            ></textarea>

          </div>

          <button type="submit" className="reservation-btn">
            Reserve Now
          </button>

        </form>
      </div>

      <div className="reservation-image">
        <img
          src={reserveImage}
          alt="Restaurant"
        />
      </div>
    </section>
  );
}