import React, { useState, useEffect, useCallback, useRef } from 'react';
import CandleChart from './CandleChart';
import cryptoService from '../services/cryptoService';

const ChartModal = ({ symbol, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  
  // Refs for real-time functionality
  const realTimeInterval = useRef(null);
  const priceUpdateInterval = useRef(null);
  const lastPrice = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Refreshing data for ${symbol}...`);
      
      // Fetch both chart data and crypto info
      const [chartDataResult, cryptoInfoResult] = await Promise.all([
        cryptoService.getHistoricalData(symbol, timeframe),
        cryptoService.getCryptoBySymbol(symbol)
      ]);
      
      setChartData(chartDataResult);
      setCryptoInfo(cryptoInfoResult);
      setLastUpdated(new Date());
      lastPrice.current = cryptoInfoResult?.quote?.USD?.price;
      console.log(`Data refreshed successfully for ${symbol}`);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load chart data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  // Real-time price updates simulation
  const updateRealTimePrice = useCallback(() => {
    if (!cryptoInfo) return;
    
    // Simulate real-time price changes
    const currentPrice = cryptoInfo.quote?.USD?.price || 0;
    const volatility = 0.001; // 0.1% max change per update
    const change = currentPrice * volatility * (Math.random() > 0.5 ? 1 : -1);
    const newPrice = currentPrice + change;
    
    // Update the last candlestick with new price data
    setChartData(prevData => {
      if (prevData.length === 0) return prevData;
      
      const updatedData = [...prevData];
      const lastCandle = updatedData[updatedData.length - 1];
      
      // Create new real-time candlestick
      const newCandle = {
        ...lastCandle,
        time: new Date(),
        close: newPrice,
        high: Math.max(lastCandle.high, newPrice),
        low: Math.min(lastCandle.low, newPrice)
      };
      
      // Update last candle or add new one if time has passed
      const now = new Date();
      const timeDiff = now - lastCandle.time;
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (timeDiff >= fiveMinutes) {
        // Add new candlestick
        updatedData.push({
          time: now,
          open: lastCandle.close,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume: Math.random() * 1000000 + 500000
        });
        
        // Keep only last 1000 candlesticks for performance
        if (updatedData.length > 1000) {
          updatedData.splice(0, updatedData.length - 1000);
        }
      } else {
        // Update existing candlestick
        updatedData[updatedData.length - 1] = newCandle;
      }
      
      return updatedData;
    });
    
    // Update crypto info with new price
    setCryptoInfo(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        quote: {
          ...prev.quote,
          USD: {
            ...prev.quote.USD,
            price: newPrice,
            percent_change_24h: prev.quote.USD.percent_change_24h + (change / currentPrice * 100)
          }
        }
      };
    });
    
    setLastUpdated(new Date());
    lastPrice.current = newPrice;
  }, [cryptoInfo]);

  // Start real-time updates
  const startRealTimeUpdates = useCallback(() => {
    // Update price every 2 seconds for real-time feel
    priceUpdateInterval.current = setInterval(updateRealTimePrice, 2000);
    
    // Refresh full data every 5 minutes
    realTimeInterval.current = setInterval(() => {
      if (!loading) {
        fetchData();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    console.log('Real-time updates started');
  }, [updateRealTimePrice, fetchData, loading]);

  // Stop real-time updates
  const stopRealTimeUpdates = useCallback(() => {
    if (priceUpdateInterval.current) {
      clearInterval(priceUpdateInterval.current);
      priceUpdateInterval.current = null;
    }
    if (realTimeInterval.current) {
      clearInterval(realTimeInterval.current);
      realTimeInterval.current = null;
    }
    console.log('Real-time updates stopped');
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Always start real-time updates
  useEffect(() => {
    startRealTimeUpdates();
    
    return () => {
      stopRealTimeUpdates();
    };
  }, [startRealTimeUpdates, stopRealTimeUpdates]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleManualRefresh = () => {
    fetchData();
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '$0';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatLastUpdated = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading {symbol} chart...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Chart</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button className="retry-button" onClick={handleManualRefresh}>
                Retry
              </button>
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Real-time Header */}
            <div className="realtime-chart-header">
              <div className="chart-title">
                <h2>{symbol}</h2>
                <div className="realtime-info">
                  <span className="current-price-large">
                    {formatPrice(cryptoInfo?.quote?.USD?.price)}
                  </span>
                  <span className={`price-change-simple ${cryptoInfo?.quote?.USD?.percent_change_24h >= 0 ? 'positive' : 'negative'}`}>
                    {cryptoInfo?.quote?.USD?.percent_change_24h >= 0 ? '+' : ''}{cryptoInfo?.quote?.USD?.percent_change_24h?.toFixed(2)}%
                  </span>
                  <div className="realtime-status">
                    <span className="status-indicator connected"></span>
                    <span className="status-text">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="realtime-controls">
                <button className="close-button-simple" onClick={onClose}>&times;</button>
              </div>
            </div>
            
            {/* Timeframe Selector */}
            <div className="simple-timeframe-selector">
              <button 
                className={timeframe === '12H' ? 'active' : ''}
                onClick={() => handleTimeframeChange('12H')}
              >
                12H
              </button>
              <button 
                className={timeframe === '1D' ? 'active' : ''}
                onClick={() => handleTimeframeChange('1D')}
              >
                1D
              </button>
              <button 
                className={timeframe === '1W' ? 'active' : ''}
                onClick={() => handleTimeframeChange('1W')}
              >
                1W
              </button>
              <button 
                className={timeframe === '1M' ? 'active' : ''}
                onClick={() => handleTimeframeChange('1M')}
              >
                1M
              </button>
              <button 
                className={timeframe === '1Y' ? 'active' : ''}
                onClick={() => handleTimeframeChange('1Y')}
              >
                1Y
              </button>
            </div>
            
            {/* Real-time Chart */}
            <div className="simple-chart-wrapper">
              <CandleChart 
                data={chartData} 
                symbol={symbol} 
                onClose={onClose}
                isRealTime={true}
              />
            </div>
            
            {/* Real-time Footer */}
            <div className="realtime-footer">
              <div className="info-item">
                <span className="info-label">Market Cap</span>
                <span className="info-value">{formatMarketCap(cryptoInfo?.quote?.USD?.market_cap)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Volume (24h)</span>
                <span className="info-value">{formatMarketCap(cryptoInfo?.quote?.USD?.volume_24h || 0)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatLastUpdated(lastUpdated)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value status-connected">
                  LIVE
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartModal;