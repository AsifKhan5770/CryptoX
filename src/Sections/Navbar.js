import { Link } from "react-router-dom";

let Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg custom-navbar animated-navbar sticky-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand text-glow" to="#/">
          CryptoX 🚀
        </Link>
        <button
          className="navbar-toggler bg-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link nav-anim" to="#/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-anim" to="#/cryptos">Cryptos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-anim" to="#/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
};
export default Navbar;
