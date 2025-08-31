import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

let Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg custom-navbar ${scrolled ? "scrolled" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <span className="crypto-logo">CryptoX</span>
            <span className="rocket-icon">🚀</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-controls="navbarNav"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-text">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cryptos" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-text">Cryptos</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-text">Contact</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link get-started-btn" to="/start" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-text">Get Started</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
