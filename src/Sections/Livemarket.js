import { useState, useEffect, useRef } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice, formatPercentChange, getCoinSymbol, getCoinColor, getPriceChangeClass } from "../utils/cryptoUtils";
import ChartModal from "../components/ChartModal";

let Livemarket = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const sectionRef = useRef(null);

  // Fetch cryptocurrency data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getLatestListings(4);
        
        // Transform API data to component format
        const formattedData = data.map(coin => ({
          name: `${coin.name} (${coin.symbol})`,
          price: formatPrice(coin.quote.USD.price),
          change: formatPercentChange(coin.quote.USD.percent_change_24h),
          isUp: coin.quote.USD.percent_change_24h >= 0,
          icon: getCoinSymbol(coin.symbol),
          color: getCoinColor(coin.symbol),
          symbol: coin.symbol
        }));
        
        setMarketData(formattedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Fallback to default data if API fails
        setMarketData([
          {
            name: "Bitcoin (BTC)",
            price: "$29,430.21",
            change: "+2.34%",
            isUp: true,
            icon: "₿",
            color: "#f7931a",
            symbol: "BTC"
          },
          {
            name: "Ethereum (ETH)",
            price: "$1,945.67",
            change: "-1.12%",
            isUp: false,
            icon: "Ξ",
            color: "#627eea",
            symbol: "ETH"
          },
          {
            name: "Solana (SOL)",
            price: "$86.23",
            change: "+3.95%",
            isUp: true,
            icon: "◎",
            color: "#00ffbd",
            symbol: "SOL"
          },
          {
            name: "Cardano (ADA)",
            price: "$0.42",
            change: "+1.23%",
            isUp: true,
            icon: "₳",
            color: "#0033ad",
            symbol: "ADA"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    // Set up refresh interval (every 60 seconds)
    const refreshInterval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Animation visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);


  return(
    <>
      {selectedCoin && (
        <ChartModal 
          symbol={selectedCoin} 
          onClose={() => setSelectedCoin(null)} 
        />
      )}
      <section className="market-stats" ref={sectionRef}>
        <div className="container">
          <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>
            <span className="text-gradient">Live</span> Market Stats
          </h2>
          <div className="stats-grid">
            {marketData.map((coin, index) => (
              <div 
                key={index} 
                className={`stat-card ${isVisible ? "visible" : ""}`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  '--coin-color': coin.color
                }}
                onClick={() => setSelectedCoin(coin.symbol)}
              >
                <div className="coin-icon" style={{ background: coin.color }}>
                  {coin.icon}
                </div>
                <h3>{coin.name}</h3>
                <p className="price">{coin.price}</p>
                <p className={`change ${coin.isUp ? "up" : "down"}`}>
                  <span className="change-arrow">{coin.isUp ? "↑" : "↓"}</span> {coin.change}
                </p>
                <div className="stat-card-bg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
    )
}
export default Livemarket