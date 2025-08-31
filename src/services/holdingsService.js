// Holdings Service - Manages cryptocurrency holdings and transactions
class HoldingsService {
  constructor() {
    this.holdings = this.loadHoldings();
    this.transactions = this.loadTransactions();
  }

  // Load holdings from localStorage
  loadHoldings() {
    try {
      const stored = localStorage.getItem('cryptox_holdings');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading holdings:', error);
      return {};
    }
  }

  // Load transaction history from localStorage
  loadTransactions() {
    try {
      const stored = localStorage.getItem('cryptox_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
    }

  // Save holdings to localStorage
  saveHoldings() {
    try {
      localStorage.setItem('cryptox_holdings', JSON.stringify(this.holdings));
    } catch (error) {
      console.error('Error saving holdings:', error);
    }
  }

  // Save transactions to localStorage
  saveTransactions() {
    try {
      localStorage.setItem('cryptox_transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  // Buy cryptocurrency
  buyCrypto(symbol, amount, price, timestamp = new Date()) {
    const coinSymbol = symbol.toUpperCase();
    
    if (!this.holdings[coinSymbol]) {
      this.holdings[coinSymbol] = {
        symbol: coinSymbol,
        quantity: 0,
        totalInvested: 0,
        averagePrice: 0,
        lastUpdated: timestamp
      };
    }

    const holding = this.holdings[coinSymbol];
    const quantity = amount / price;
    
    // Calculate new average price
    const totalValue = holding.quantity * holding.averagePrice + amount;
    const totalQuantity = holding.quantity + quantity;
    holding.averagePrice = totalValue / totalQuantity;
    
    holding.quantity += quantity;
    holding.totalInvested += amount;
    holding.lastUpdated = timestamp;

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: 'BUY',
      symbol: coinSymbol,
      quantity: quantity,
      price: price,
      amount: amount,
      timestamp: timestamp,
      fee: amount * 0.001 // 0.1% trading fee
    };

    this.transactions.push(transaction);
    
    this.saveHoldings();
    this.saveTransactions();
    
    return {
      success: true,
      holding: this.holdings[coinSymbol],
      transaction: transaction
    };
  }

  // Sell cryptocurrency
  sellCrypto(symbol, quantity, price, timestamp = new Date()) {
    const coinSymbol = symbol.toUpperCase();
    
    if (!this.holdings[coinSymbol] || this.holdings[coinSymbol].quantity < quantity) {
      return {
        success: false,
        error: 'Insufficient holdings'
      };
    }

    const holding = this.holdings[coinSymbol];
    const amount = quantity * price;
    
    holding.quantity -= quantity;
    holding.totalInvested = holding.quantity * holding.averagePrice;
    
    // Remove holding if quantity becomes 0
    if (holding.quantity <= 0) {
      delete this.holdings[coinSymbol];
    } else {
      holding.lastUpdated = timestamp;
    }

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: 'SELL',
      symbol: coinSymbol,
      quantity: quantity,
      price: price,
      amount: amount,
      timestamp: timestamp,
      fee: amount * 0.001 // 0.1% trading fee
    };

    this.transactions.push(transaction);
    
    this.saveHoldings();
    this.saveTransactions();
    
    return {
      success: true,
      holding: this.holdings[coinSymbol] || null,
      transaction: transaction
    };
  }

  // Get all holdings
  getHoldings() {
    return this.holdings;
  }

  // Get holding for specific coin
  getHolding(symbol) {
    return this.holdings[symbol.toUpperCase()] || null;
  }

  // Get transaction history
  getTransactions() {
    return this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get total portfolio value (requires current prices)
  getPortfolioValue(currentPrices) {
    let totalValue = 0;
    let totalInvested = 0;
    
    Object.values(this.holdings).forEach(holding => {
      const currentPrice = currentPrices[holding.symbol] || 0;
      totalValue += holding.quantity * currentPrice;
      totalInvested += holding.totalInvested;
    });
    
    return {
      totalValue,
      totalInvested,
      totalProfit: totalValue - totalInvested,
      profitPercentage: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0
    };
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    this.holdings = {};
    this.transactions = [];
    localStorage.removeItem('cryptox_holdings');
    localStorage.removeItem('cryptox_transactions');
  }
}

const holdingsService = new HoldingsService();
export default holdingsService;
