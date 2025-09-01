import { useState, useEffect, useRef } from "react";
import cryptoService from "../services/cryptoService";
import { formatPrice, formatPercentChange, getCoinSymbol, getCoinColor, getPriceChangeClass } from "../utils/cryptoUtils";
import ChartModal from "../components/ChartModal";

// Format time for last updated display
const formatLastUpdated = (date) => {
  if (!date) return "";
  
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  return `${Math.floor(diffSeconds / 3600)}h ago`;
};

let Livemarket = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("idle");
  const sectionRef = useRef(null);
  const updateTimerRef = useRef(null);

  // Fetch cryptocurrency data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setUpdateStatus("updating");
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
        setLastUpdated(new Date());
        setUpdateStatus("updated");
        
        // Set timer to change status to stale after 25 seconds
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        updateTimerRef.current = setTimeout(() => {
          setUpdateStatus("stale");
        }, 25000);
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
        if (updateStatus === "updating") {
          setUpdateStatus("error");
        }
      }
    };

    fetchCryptoData();

    // Set up refresh interval (every 30 seconds)
    const refreshInterval = setInterval(fetchCryptoData, 30000);
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


  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  // Get status indicator classes and text
  const getStatusIndicator = () => {
    switch (updateStatus) {
      case "updating":
        return { className: "status-updating", text: "Updating..." };
      case "updated":
        return { className: "status-live", text: "Live" };
      case "stale":
        return { className: "status-stale", text: "Needs refresh" };
      case "error":
        return { className: "status-error", text: "Update failed" };
      default:
        return { className: "", text: "" };
    }
  };

  const statusIndicator = getStatusIndicator();

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
          <div className="market-header">
            <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>
              <span className="text-gradient">Live</span> Market Stats
            </h2>
            <div className={`realtime-status ${statusIndicator.className}`}>
              <div className="pulse-dot"></div>
              <span>{statusIndicator.text}</span>
              {lastUpdated && <span className="last-updated">{formatLastUpdated(lastUpdated)}</span>}
            </div>
          </div>
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