import { useState, useEffect } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice, formatPercentChange, getPriceChangeClass } from "../utils/cryptoUtils";
import ChartModal from "../components/ChartModal";

let Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getLatestListings(4);
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
        // Fallback to empty array if API fails
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();

    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(fetchCoins, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Function to get chart width based on percent change
  const getChartWidth = (percentChange) => {
    // Convert percent change to a width between 30% and 80%
    const absChange = Math.abs(percentChange);
    const width = Math.min(Math.max(30 + absChange * 2, 30), 80);
    return `${width}%`;
  };

  // Function to get coin image URL
  const getCoinImage = (symbol) => {
    const imageMap = {
      BTC: "https://m.economictimes.com/thumb/msid-79280279,width-1200,height-900,resizemode-4,imgsize-678018/bitcoin.jpg",
      ETH: "https://cdn.vectorstock.com/i/1000v/69/97/golden-ethereum-coin-symbol-vector-19116997.jpg",
      SOL: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
      ADA: "https://c8.alamy.com/comp/2G72ACR/cardano-coin-crypto-currency-blockchain-coin-cardano-ada-symbol-vector-illustration-2G72ACR.jpg",
      // Add more mappings as needed
    };
    
    return imageMap[symbol] || `https://via.placeholder.com/150x150?text=${symbol}`;
  };

  return (
    <>
      {selectedCoin && (
        <ChartModal 
          symbol={selectedCoin} 
          onClose={() => setSelectedCoin(null)} 
        />
      )}
      <section className="crypto-coins">
        <div className="container">
          <h2 className="section-title">Top Cryptocurrencies</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading cryptocurrencies...</p>
            </div>
          ) : (
            <div className="coin-grid">
              {coins.map((coin) => {
                const percentChange = coin.quote.USD.percent_change_24h;
                const isUp = percentChange >= 0;
                const chartClass = isUp ? "up" : "down";
                
                return (
                  <div className="coin-card" key={coin.id} onClick={() => setSelectedCoin(coin.symbol)}>
                    <div className="coin-header">
                      <img
                        src={getCoinImage(coin.symbol)}
                        alt={coin.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/150x150?text=${coin.symbol}`;
                        }}
                      />
                      <h3>
                        {coin.name} <span>({coin.symbol})</span>
                      </h3>
                    </div>
                    <p className="price">{formatPrice(coin.quote.USD.price)}</p>
                    <div className="chart-bar">
                      <div 
                        className={`chart-line ${chartClass}`} 
                        style={{ width: getChartWidth(percentChange) }}
                      ></div>
                    </div>
                    <p className={`change ${getPriceChangeClass(percentChange)}`}>
                      {formatPercentChange(percentChange)}
                    </p>
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
export default Coins;
