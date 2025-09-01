import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice } from "../utils/cryptoUtils";
import { useHoldings } from "../context/HoldingsContext";

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
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const [sellMessage, setSellMessage] = useState('');
  
  // Get holdings context
  const { buyCrypto, sellCrypto, getHolding, updateCurrentPrices } = useHoldings();
  
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
        
        // Update current prices in holdings context
        updateCurrentPrices(prices);
        
        // Set default selected coins if they exist in the data
        if (data.length > 0) {
          // Keep current selections if they exist in the new data
          const buyCoinExists = data.some(coin => coin.symbol === selectedBuyCoin);
          const sellCoinExists = data.some(coin => coin.symbol === selectedSellCoin);
          
          if (!buyCoinExists) {
            setSelectedBuyCoin(data[0].symbol);
          }
          
          if (!sellCoinExists) {
            setSelectedSellCoin(data[0].symbol);
          }
        }
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        // Use fallback data
        const fallbackPrices = {
          BTC: 29430.21,
          ETH: 1945.67,
          SOL: 86.23,
          ADA: 0.45,
          DOT: 5.78
        };
        pricesRef.current = fallbackPrices;
        updateCurrentPrices(fallbackPrices);
        
        // Create fallback crypto data for dropdowns
        const fallbackCryptoData = [
          { symbol: 'BTC', name: 'Bitcoin', quote: { USD: { price: fallbackPrices.BTC } } },
          { symbol: 'ETH', name: 'Ethereum', quote: { USD: { price: fallbackPrices.ETH } } },
          { symbol: 'SOL', name: 'Solana', quote: { USD: { price: fallbackPrices.SOL } } },
          { symbol: 'ADA', name: 'Cardano', quote: { USD: { price: fallbackPrices.ADA } } },
          { symbol: 'DOT', name: 'Polkadot', quote: { USD: { price: fallbackPrices.DOT } } }
        ];
        setCryptoData(fallbackCryptoData);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    
    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(refreshInterval);
  }, [updateCurrentPrices]);

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

  // Handle buy form submission
  const handleBuySubmit = async (e) => {
    e.preventDefault();
    
    if (!buyAmount || buyAmount === '' || parseFloat(buyAmount) <= 0) {
      setBuyMessage('Please enter a valid amount greater than 0');
      return;
    }

    const amount = parseFloat(buyAmount);
    const price = pricesRef.current[selectedBuyCoin];
    
    if (!price) {
      setBuyMessage('Unable to get current price');
      return;
    }

    setBuyLoading(true);
    setBuyMessage('');

    try {
      const result = buyCrypto(selectedBuyCoin, amount, price);
      
      if (result.success) {
        setBuyMessage(`Successfully bought ${result.transaction.quantity.toFixed(8)} ${selectedBuyCoin}!`);
        setBuyAmount('');
        setBuyEstimate('0');
        
        // Clear success message after 3 seconds
        setTimeout(() => setBuyMessage(''), 3000);
      } else {
        setBuyMessage(result.error || 'Buy transaction failed');
      }
    } catch (error) {
      setBuyMessage('An error occurred during the transaction');
    } finally {
      setBuyLoading(false);
    }
  };

  // Handle sell form submission
  const handleSellSubmit = async (e) => {
    e.preventDefault();
    
    if (!sellAmount || sellAmount === '' || parseFloat(sellAmount) <= 0) {
      setSellMessage('Please enter a valid quantity greater than 0');
      return;
    }

    const quantity = parseFloat(sellAmount);
    const price = pricesRef.current[selectedSellCoin];
    const holding = getHolding(selectedSellCoin);
    
    if (!price) {
      setSellMessage('Unable to get current price');
      return;
    }

    if (!holding || holding.quantity < quantity) {
      setSellMessage(`Insufficient ${selectedSellCoin} holdings. You have ${holding ? holding.quantity.toFixed(8) : '0'}`);
      return;
    }

    setSellLoading(true);
    setSellMessage('');

    try {
      const result = sellCrypto(selectedSellCoin, quantity, price);
      
      if (result.success) {
        setSellMessage(`Successfully sold ${quantity.toFixed(8)} ${selectedSellCoin} for ${formatPrice(result.transaction.amount)}!`);
        setSellAmount('');
        setSellEstimate('$0');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSellMessage(''), 3000);
      } else {
        setSellMessage(result.error || 'Sell transaction failed');
      }
    } catch (error) {
      setSellMessage('An error occurred during the transaction');
    } finally {
      setSellLoading(false);
    }
  };

  // Get current holding for selected sell coin
  const getCurrentHolding = () => {
    const holding = getHolding(selectedSellCoin);
    return holding ? holding.quantity : 0;
  };

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
              <form onSubmit={handleBuySubmit}>
                <label htmlFor="buy-coin">Select Coin</label>
                <select 
                  id="buy-coin" 
                  value={selectedBuyCoin}
                  onChange={(e) => {
                    setSelectedBuyCoin(e.target.value);
                    setBuyAmount('');
                  }}
                >
                  {cryptoData.length > 0 ? (
                    cryptoData.map(coin => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.name} ({coin.symbol}) - {formatPrice(coin.quote.USD.price)}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="ADA">Cardano (ADA)</option>
                      <option value="DOT">Polkadot (DOT)</option>
                    </>
                  )}
                </select>

                <label htmlFor="buy-amount">Amount (USD)</label>
                <input 
                  type="number" 
                  id="buy-amount" 
                  placeholder="$100" 
                  value={buyAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseFloat(value) >= 0) {
                      setBuyAmount(value);
                    } else {
                      setBuyAmount('0');
                      setBuyMessage('Value adjusted to nearest valid amount: $0');
                      setTimeout(() => setBuyMessage(''), 3000);
                    }
                  }}
                  step="0.01"
                  noValidate
                />

                <p className="estimate">
                  You'll receive: <span id="buy-estimate">{buyEstimate}</span> coins
                </p>

                {buyMessage && (
                  <div className={`message ${buyMessage.includes('Successfully') ? 'success' : 'error'}`}>
                    {buyMessage}
                  </div>
                )}

                <button type="submit" className="btn" disabled={buyLoading}>
                  {buyLoading ? 'Processing...' : 'Buy Now'}
                </button>
              </form>
            </div>

            {/*  Sell Box */}
            <div className="sell-box">
              <h3>Sell Crypto</h3>
              <form onSubmit={handleSellSubmit}>
                <label htmlFor="sell-coin">Select Coin</label>
                <select 
                  id="sell-coin"
                  value={selectedSellCoin}
                  onChange={(e) => {
                    setSelectedSellCoin(e.target.value);
                    setSellAmount('');
                  }}
                >
                  {cryptoData.length > 0 ? (
                    cryptoData.map(coin => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.name} ({coin.symbol}) - {formatPrice(coin.quote.USD.price)}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="ADA">Cardano (ADA)</option>
                      <option value="DOT">Polkadot (DOT)</option>
                    </>
                  )}
                </select>

                <div className="holding-info">
                  <span>Your Holdings: {getCurrentHolding().toFixed(8)} {selectedSellCoin}</span>
                </div>

                <label htmlFor="sell-amount">Amount (in Coin)</label>
                <div className="amount-input-container">
                  <input 
                    type="number" 
                    id="sell-amount" 
                    placeholder="0.01" 
                    value={sellAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      const currentHolding = getCurrentHolding();
                      
                      if (value === '') {
                        setSellAmount('');
                      } else if (parseFloat(value) < 0) {
                        setSellAmount('0');
                        setSellMessage('Value adjusted to nearest valid amount: 0');
                        setTimeout(() => setSellMessage(''), 3000);
                      } else if (parseFloat(value) > currentHolding) {
                        setSellAmount(currentHolding.toString());
                        setSellMessage(`Value adjusted to maximum available: ${currentHolding.toFixed(8)}`);
                        setTimeout(() => setSellMessage(''), 3000);
                      } else {
                        setSellAmount(value);
                      }
                    }}
                    step="0.00000001"
                    noValidate
                  />
                  <button 
                    type="button" 
                    className="sell-all-btn" 
                    onClick={() => setSellAmount(getCurrentHolding().toString())}
                    disabled={getCurrentHolding() <= 0}
                  >
                    Sell All
                  </button>
                </div>

                <p className="estimate">
                  You'll receive: <span id="sell-estimate">{sellEstimate}</span>
                </p>

                {sellMessage && (
                  <div className={`message ${sellMessage.includes('Successfully') ? 'success' : 'error'}`}>
                    {sellMessage}
                  </div>
                )}

                <button type="submit" className="btn alt" disabled={sellLoading || getCurrentHolding() <= 0}>
                  {sellLoading ? 'Processing...' : 'Sell Now'}
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
