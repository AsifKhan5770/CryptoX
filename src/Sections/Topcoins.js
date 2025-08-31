import { useState, useEffect } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice, formatPercentChange, getPriceChangeClass } from "../utils/cryptoUtils";
import ChartModal from "../components/ChartModal";

let Topcoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getLatestListings(10);
        setCoins(data);
      } catch (error) {
        console.error("Error fetching top coins:", error);
        // Fallback to empty array if API fails
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCoins();

    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(fetchTopCoins, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Function to get logo URL based on symbol
  const getCoinLogo = (symbol) => {
    return `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`;
  };

  return (
   <>
   {selectedCoin && (
      <ChartModal 
        symbol={selectedCoin} 
        onClose={() => setSelectedCoin(null)} 
      />
    )}
   <section className="top-ten-coins">
  <div className="container">
    <h2 className="section-title">Top 10 Performing Coins</h2>
    
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading top coins...</p>
      </div>
    ) : (
      <div className="top-ten-grid">
        {coins.map((coin, index) => {
          const percentChange = coin.quote.USD.percent_change_24h;
          const isUp = percentChange >= 0;
          
          return (
            <div className="coin-item" key={coin.id} onClick={() => setSelectedCoin(coin.symbol)}>
              <div className="coin-info">
                <img 
                  src={getCoinLogo(coin.symbol.toLowerCase())} 
                  alt={coin.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32x32?text=" + coin.symbol;
                  }}
                />
                <div>
                  <h3>{coin.name} ({coin.symbol})</h3>
                  <p className={`change ${getPriceChangeClass(percentChange)}`}>
                    {formatPercentChange(percentChange)}
                  </p>
                </div>
              </div>
              <p className="price">{formatPrice(coin.quote.USD.price)}</p>
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>
   </>             
  );
};
export default Topcoins;
