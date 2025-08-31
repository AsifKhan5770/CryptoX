/**
 * Utility functions for formatting cryptocurrency data
 */

// Format price with appropriate commas and decimal places
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    // Try to convert string to number if it's not already a number
    price = parseFloat(String(price).replace(/[^0-9.]/g, ''));
  }
  
  if (isNaN(price)) return '$0.00';
  
  // Format based on price magnitude
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    // For very small values, show more decimal places
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
  }
};

// Format percentage change with + or - sign
export const formatPercentChange = (percentChange) => {
  if (typeof percentChange !== 'number') {
    // Try to convert string to number if it's not already a number
    percentChange = parseFloat(String(percentChange).replace(/[^0-9.-]/g, ''));
  }
  
  if (isNaN(percentChange)) return '+0.00%';
  
  const sign = percentChange >= 0 ? '+' : '';
  return `${sign}${percentChange.toFixed(2)}%`;
};

// Format market cap with appropriate suffix (B, M, etc)
export const formatMarketCap = (marketCap) => {
  if (typeof marketCap !== 'number') {
    // Try to convert string to number if it's not already a number
    marketCap = parseFloat(String(marketCap).replace(/[^0-9.]/g, ''));
  }
  
  if (isNaN(marketCap)) return '$0';
  
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
};

// Get appropriate CSS class based on price change direction
export const getPriceChangeClass = (percentChange) => {
  if (typeof percentChange !== 'number') {
    percentChange = parseFloat(String(percentChange).replace(/[^0-9.-]/g, ''));
  }
  
  return percentChange >= 0 ? 'up' : 'down';
};

// Get appropriate icon based on price change direction
export const getPriceChangeIcon = (percentChange) => {
  if (typeof percentChange !== 'number') {
    percentChange = parseFloat(String(percentChange).replace(/[^0-9.-]/g, ''));
  }
  
  return percentChange >= 0 ? '↑' : '↓';
};

// Get coin icon/symbol for display
export const getCoinSymbol = (symbol) => {
  const symbols = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'SOL': '◎',
    'ADA': '₳',
    'BNB': 'BNB',
    'XRP': 'XRP',
    'USDC': '$',
    'USDT': '$',
    'MATIC': 'M',
    'LTC': 'Ł',
    'DOT': '●',
    'DOGE': 'Ð',
    'AVAX': 'AVAX',
    'LINK': 'LINK',
    'UNI': 'UNI',
    'ARB': 'ARB'
  };
  
  return symbols[symbol] || symbol;
};

// Get coin color for styling
export const getCoinColor = (symbol) => {
  const colors = {
    'BTC': '#f7931a',
    'ETH': '#627eea',
    'SOL': '#00ffbd',
    'ADA': '#0033ad',
    'BNB': '#f3ba2f',
    'XRP': '#00aae4',
    'USDC': '#2775ca',
    'USDT': '#26a17b',
    'MATIC': '#8247e5',
    'LTC': '#345d9d',
    'DOT': '#e6007a',
    'DOGE': '#c3a634',
    'AVAX': '#e84142',
    'LINK': '#2a5ada',
    'UNI': '#ff007a',
    'ARB': '#2d374b'
  };
  
  return colors[symbol] || '#00ffe7';
};