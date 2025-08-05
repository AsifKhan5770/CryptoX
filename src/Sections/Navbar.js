import { Link } from "react-router-dom";
let Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg" id="bgcolor">
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/"> CryptoX
          </Link>
          <button
            className="navbar-toggler"
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
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/cryptos">
                  Cryptos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/contact">
                  Contact
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
