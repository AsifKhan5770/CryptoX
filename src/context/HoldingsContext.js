import React, { createContext, useContext, useState, useEffect } from 'react';
import holdingsService from '../services/holdingsService';

const HoldingsContext = createContext();

export const useHoldings = () => {
  const context = useContext(HoldingsContext);
  if (!context) {
    throw new Error('useHoldings must be used within a HoldingsProvider');
  }
  return context;
};

export const HoldingsProvider = ({ children }) => {
  const [holdings, setHoldings] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState({
    totalValue: 0,
    totalInvested: 0,
    totalProfit: 0,
    profitPercentage: 0
  });
  const [currentPrices, setCurrentPrices] = useState({});

  // Load initial holdings
  useEffect(() => {
    const loadHoldings = () => {
      const holdingsData = holdingsService.getHoldings();
      const transactionsData = holdingsService.getTransactions();
      setHoldings(holdingsData);
      setTransactions(transactionsData);
    };

    loadHoldings();
  }, []);

  // Update portfolio value when holdings or prices change
  useEffect(() => {
    const updatePortfolioValue = () => {
      const portfolio = holdingsService.getPortfolioValue(currentPrices);
      setPortfolioValue(portfolio);
    };

    updatePortfolioValue();
  }, [holdings, currentPrices]);

  // Buy cryptocurrency
  const buyCrypto = (symbol, amount, price) => {
    try {
      const result = holdingsService.buyCrypto(symbol, amount, price);
      if (result.success) {
        setHoldings(holdingsService.getHoldings());
        setTransactions(holdingsService.getTransactions());
        return result;
      }
      return result;
    } catch (error) {
      console.error('Error buying crypto:', error);
      return { success: false, error: 'Transaction failed' };
    }
  };

  // Sell cryptocurrency
  const sellCrypto = (symbol, quantity, price) => {
    try {
      const result = holdingsService.sellCrypto(symbol, quantity, price);
      if (result.success) {
        setHoldings(holdingsService.getHoldings());
        setTransactions(holdingsService.getTransactions());
        return result;
      }
      return result;
    } catch (error) {
      console.error('Error selling crypto:', error);
      return { success: false, error: 'Transaction failed' };
    }
  };

  // Update current prices
  const updateCurrentPrices = (prices) => {
    setCurrentPrices(prices);
  };

  // Get holding for specific coin
  const getHolding = (symbol) => {
    return holdings[symbol.toUpperCase()] || null;
  };

  // Get total quantity for a coin
  const getTotalQuantity = (symbol) => {
    const holding = holdings[symbol.toUpperCase()];
    return holding ? holding.quantity : 0;
  };

  // Get total invested for a coin
  const getTotalInvested = (symbol) => {
    const holding = holdings[symbol.toUpperCase()];
    return holding ? holding.totalInvested : 0;
  };

  // Get average price for a coin
  const getAveragePrice = (symbol) => {
    const holding = holdings[symbol.toUpperCase()];
    return holding ? holding.averagePrice : 0;
  };

  // Clear all data (for testing/reset)
  const clearAllData = () => {
    holdingsService.clearAllData();
    setHoldings({});
    setTransactions([]);
    setPortfolioValue({
      totalValue: 0,
      totalInvested: 0,
      totalProfit: 0,
      profitPercentage: 0
    });
  };

  const value = {
    holdings,
    transactions,
    portfolioValue,
    currentPrices,
    buyCrypto,
    sellCrypto,
    updateCurrentPrices,
    getHolding,
    getTotalQuantity,
    getTotalInvested,
    getAveragePrice,
    clearAllData
  };

  return (
    <HoldingsContext.Provider value={value}>
      {children}
    </HoldingsContext.Provider>
  );
};
