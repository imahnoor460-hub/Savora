import { Link } from "react-router-dom";
import "./Home.css";
import storyImage from "../assets/story.jpg";

/**
 * Standalone Story page.
 *
 * Reuses the .savora-story-section / .story-* styles the Home page already
 * defines, so the two stay visually identical; only the page-level spacing
 * (.story-page) is added on top.
 */
export default function Story() {
  return (
    <section className="savora-story-section story-page">
      <div className="story-container">
        <div className="story-image-card">
          <img
            src={storyImage}
            alt="The Savora counter and open oak hearth"
            className="story-img"
          />
        </div>

        <div className="story-text-block">
          <span className="story-subtitle">The Story</span>

          <h2 className="story-title">
            Eighteen chairs, <span className="title-gradient">one fire</span>
          </h2>

          <p className="story-paragraph">
            Savora began as a six-seat counter above a Mayfair wine cellar. The
            counter is still here — larger, darker, lit by a single seam of
            brass — and the hearth still burns oak from the same Suffolk grove.
          </p>

          <p className="story-paragraph">
            There is no à la carte. There is only the evening, and what the
            morning boats and the kitchen garden decided it should be.
          </p>

          <div className="story-chef">Elio Marchetti</div>
          <div className="story-chef-title">Chef Patron</div>

          <div className="story-page-actions">
            <Link to="/reservation" className="btn-gold-primary">
              Reserve a Table
            </Link>
            <Link to="/menu" className="btn-outline-light">
              View the Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
