import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHoldings } from "../context/HoldingsContext";
import { formatPrice } from "../utils/cryptoUtils";

let Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [holdingsDropdownOpen, setHoldingsDropdownOpen] = useState(false);
  
  // Get holdings context
  const { holdings, portfolioValue, currentPrices } = useHoldings();

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

  const toggleHoldingsDropdown = () => {
    setHoldingsDropdownOpen(!holdingsDropdownOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.holdings-dropdown')) {
        setHoldingsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get total number of different coins held
  const getTotalCoinsHeld = () => {
    return Object.keys(holdings).length;
  };

  // Get portfolio profit/loss color
  const getProfitColor = () => {
    if (portfolioValue.totalProfit > 0) return 'text-success';
    if (portfolioValue.totalProfit < 0) return 'text-danger';
    return 'text-muted';
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
              
              {/* Holdings Dropdown */}
              <li className="nav-item holdings-dropdown">
                <button 
                  className="nav-link holdings-btn" 
                  onClick={toggleHoldingsDropdown}
                >
                  <span className="nav-text">
                    💼 Holdings ({getTotalCoinsHeld()})
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {holdingsDropdownOpen && (
                  <div className="holdings-dropdown-menu">
                    <div className="holdings-header">
                      <h6>Portfolio Overview</h6>
                      <div className="portfolio-summary">
                        <div className="portfolio-item">
                          <span className="label">Total Value:</span>
                          <span className="value">{formatPrice(portfolioValue.totalValue)}</span>
                        </div>
                        <div className="portfolio-item">
                          <span className="label">Total Invested:</span>
                          <span className="value">{formatPrice(portfolioValue.totalInvested)}</span>
                        </div>
                        <div className="portfolio-item">
                          <span className="label">P&L:</span>
                          <span className={`value ${getProfitColor()}`}>
                            {portfolioValue.totalProfit >= 0 ? '+' : ''}{formatPrice(portfolioValue.totalProfit)}
                          </span>
                        </div>
                        <div className="portfolio-item">
                          <span className="label">P&L %:</span>
                          <span className={`value ${getProfitColor()}`}>
                            {portfolioValue.profitPercentage >= 0 ? '+' : ''}{portfolioValue.profitPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="holdings-list">
                      {Object.keys(holdings).length === 0 ? (
                        <div className="no-holdings">
                          <p>No holdings yet</p>
                          <small>Buy some crypto to see your portfolio here!</small>
                        </div>
                      ) : (
                        Object.values(holdings).map(holding => {
                          const currentPrice = currentPrices[holding.symbol] || 0;
                          const currentValue = holding.quantity * currentPrice;
                          const profit = currentValue - holding.totalInvested;
                          const profitPercentage = holding.totalInvested > 0 ? (profit / holding.totalInvested) * 100 : 0;
                          
                          return (
                            <div key={holding.symbol} className="holding-item">
                              <div className="holding-header">
                                <span className="coin-symbol">{holding.symbol}</span>
                                <span className="coin-quantity">{holding.quantity.toFixed(8)}</span>
                              </div>
                              <div className="holding-details">
                                <div className="detail-row">
                                  <span className="label">Avg Price:</span>
                                  <span className="value">{formatPrice(holding.averagePrice)}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Current Value:</span>
                                  <span className="value">{formatPrice(currentValue)}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">P&L:</span>
                                  <span className={`value ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {profit >= 0 ? '+' : ''}{formatPrice(profit)} ({profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
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
