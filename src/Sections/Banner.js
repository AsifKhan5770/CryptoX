import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice } from "../utils/cryptoUtils";

let Banner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedBuyCoin, setSelectedBuyCoin] = useState('BTC');
  const [selectedSellCoin, setSelectedSellCoin] = useState('BTC');
  const [buyEstimate, setBuyEstimate] = useState('0');
  const [sellEstimate, setSellEstimate] = useState('$0');
  
  // Refs to store current prices
  const pricesRef = useRef({});

  // Fetch cryptocurrency data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getLatestListings(10);
        setCryptoData(data);
        
        // Store prices in ref for calculations
        const prices = {};
        data.forEach(coin => {
          prices[coin.symbol] = coin.quote.USD.price;
        });
        pricesRef.current = prices;
        
        // Set default selected coins if they exist in the data
        if (data.length > 0) {
          setSelectedBuyCoin(data[0].symbol);
          setSelectedSellCoin(data[0].symbol);
        }
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        // Use fallback data
        const fallbackPrices = {
          BTC: 29430.21,
          ETH: 1945.67,
          SOL: 86.23
        };
        pricesRef.current = fallbackPrices;
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    
    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Calculate buy estimate when amount or selected coin changes
  useEffect(() => {
    if (buyAmount && pricesRef.current[selectedBuyCoin]) {
      const amount = parseFloat(buyAmount);
      const price = pricesRef.current[selectedBuyCoin];
      const estimate = amount / price;
      setBuyEstimate(estimate.toFixed(8));
    } else {
      setBuyEstimate('0');
    }
  }, [buyAmount, selectedBuyCoin]);

  // Calculate sell estimate when amount or selected coin changes
  useEffect(() => {
    if (sellAmount && pricesRef.current[selectedSellCoin]) {
      const amount = parseFloat(sellAmount);
      const price = pricesRef.current[selectedSellCoin];
      const estimate = amount * price;
      setSellEstimate(formatPrice(estimate));
    } else {
      setSellEstimate('$0');
    }
  }, [sellAmount, selectedSellCoin]);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <>
      <section className="banner">
        <div className="banner-particles">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="particle"></div>
          ))}
        </div>
        <div className="banner-overlay"></div>
        <div className={`banner-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="banner-title">
            Welcome to <span className="text-gradient">CryptoX</span>
          </h1>
          <p className="banner-subtitle">Your Gateway to the Future of Decentralized Finance</p>
          <div className="banner-stats">
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Trading</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Cryptocurrencies</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0.1%</span>
              <span className="stat-label">Trading Fee</span>
            </div>
          </div>
          <div className="banner-cta">
            <Link to="/start" className="btn btn-primary pulse">
              Get Started
            </Link>
            <Link to="/cryptos" className="btn btn-secondary">
              Explore Markets
            </Link>
          </div>
        </div>
      </section>

      {/*  Buy & Sell Section */}
      <section className="buy-sell">
        <div className="container">
          <h2 className="section-title">Buy & Sell Crypto Instantly</h2>
          <div className="buy-sell-grid">
            {/* Buy Box */}
            <div className="buy-box">
              <h3>Buy Crypto</h3>
              <form id="buy-form">
                <label htmlFor="buy-coin">Select Coin</label>
                <select id="buy-coin">
                  <option value="BTC" data-rate="29430.21">
                    Bitcoin (BTC)
                  </option>
                  <option value="ETH" data-rate="1945.67">
                    Ethereum (ETH)
                  </option>
                  <option value="SOL" data-rate="86.23">
                    Solana (SOL)
                  </option>
                </select>

                <label htmlFor="buy-amount">Amount (USD)</label>
                <input type="number" id="buy-amount" placeholder="$100" />

                <p className="estimate">
                  You’ll receive: <span id="buy-estimate">0</span> coins
                </p>

                <button type="submit" className="btn">
                  Buy Now
                </button>
              </form>
            </div>

            {/*  Sell Box */}
            <div className="sell-box">
              <h3>Sell Crypto</h3>
              <form id="sell-form">
                <label htmlFor="sell-coin">Select Coin</label>
                <select id="sell-coin">
                  <option value="BTC" data-rate="29430.21">
                    Bitcoin (BTC)
                  </option>
                  <option value="ETH" data-rate="1945.67">
                    Ethereum (ETH)
                  </option>
                  <option value="SOL" data-rate="86.23">
                    Solana (SOL)
                  </option>
                </select>

                <label htmlFor="sell-amount">Amount (in Coin)</label>
                <input 
                  type="number" 
                  id="sell-amount" 
                  placeholder="0.01" 
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                />

                <p className="estimate">
                  You'll receive: <span id="sell-estimate">{sellEstimate}</span>
                </p>

                <button type="submit" className="btn alt">
                  Sell Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Banner;
