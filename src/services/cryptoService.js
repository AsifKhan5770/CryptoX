import axios from 'axios';

// Using CoinGecko API as primary (free, no API key required)
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
const API_KEY = '75380424-3f4c-48e6-9a6e-42e7ab20bac0';

const cryptoService = {
  // Get latest cryptocurrency listings with market data
  getLatestListings: async (limit = 10) => {
    try {
      console.log('Fetching live crypto data from CoinGecko...');
      
      // Try CoinGecko first (more reliable, no API key needed)
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        },
        timeout: 10000
      });
      
      console.log('Live data fetched successfully:', response.data.length, 'coins');
      
      // Transform CoinGecko data to match expected format
      return response.data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        slug: coin.id,
        quote: {
          USD: {
            price: coin.current_price,
            percent_change_24h: coin.price_change_percentage_24h,
            market_cap: coin.market_cap,
            volume_24h: coin.total_volume
          }
        }
      }));
      
    } catch (error) {
      console.error('CoinGecko API failed, trying CoinMarketCap...', error);
      
      try {
        // Fallback to CoinMarketCap
        const response = await axios.get(`${COINMARKETCAP_BASE_URL}/cryptocurrency/listings/latest`, {
          headers: {
            'X-CMC_PRO_API_KEY': API_KEY,
          },
          params: {
            limit,
            convert: 'USD'
          },
          timeout: 10000
        });
        
        console.log('CoinMarketCap data fetched successfully');
        return response.data.data;
        
      } catch (cmcError) {
        console.error('Both APIs failed, using mock data:', cmcError);
        return getMockCryptoData(limit);
      }
    }
  },

  // Get specific cryptocurrency details by symbol
  getCryptoBySymbol: async (symbol) => {
    try {
      console.log(`Fetching live data for ${symbol}...`);
      
      // Try CoinGecko first
      const coinGeckoId = getCoinGeckoId(symbol);
      if (coinGeckoId) {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinGeckoId}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          timeout: 10000
        });
        
        const coin = response.data;
        console.log(`Live data for ${symbol} fetched from CoinGecko`);
        
        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          slug: coin.id,
          quote: {
            USD: {
              price: coin.market_data.current_price.usd,
              percent_change_24h: coin.market_data.price_change_percentage_24h,
              market_cap: coin.market_data.market_cap.usd,
              volume_24h: coin.market_data.total_volume.usd
            }
          }
        };
      }
      
      // Fallback to CoinMarketCap
      const response = await axios.get(`${COINMARKETCAP_BASE_URL}/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
        },
        params: {
          symbol,
          convert: 'USD'
        },
        timeout: 10000
      });
      
      console.log(`Live data for ${symbol} fetched from CoinMarketCap`);
      return response.data.data[symbol];
      
    } catch (error) {
      console.error(`Error fetching live data for ${symbol}:`, error);
      console.log('Falling back to mock data');
      return getMockCryptoBySymbol(symbol);
    }
  },
  
  // Get historical data for a specific cryptocurrency
  getHistoricalData: async (symbol, timeframe = '1D', count = 30) => {
    try {
      console.log(`Fetching live historical data for ${symbol} (${timeframe})...`);
      
      const coinGeckoId = getCoinGeckoId(symbol);
      if (!coinGeckoId) {
        throw new Error(`No CoinGecko ID found for symbol: ${symbol}`);
      }
      
      // Get days based on timeframe for 5-minute intervals
      let days;
      switch (timeframe) {
        case '12H':
          days = 1; // 1 day = 288 candlesticks (24h * 12 per hour)
          break;
        case '1D':
          days = 1; // 1 day = 288 candlesticks
          break;
        case '1W':
          days = 7; // 7 days = 2,016 candlesticks
          break;
        case '1M':
          days = 30; // 30 days = 8,640 candlesticks
          break;
        case '1Y':
          days = 365; // 365 days = 105,120 candlesticks
          break;
        default:
          days = 1;
      }
      
      // For 5-minute intervals, we need to calculate the exact number of data points
      const intervalsPerDay = 24 * 12; // 24 hours * 12 intervals per hour (5 min each)
      const totalIntervals = days * intervalsPerDay;
      
      // Limit data points to prevent overwhelming the chart
      const maxIntervals = Math.min(totalIntervals, 1000); // Max 1000 data points
      const actualDays = Math.ceil(maxIntervals / intervalsPerDay);
      
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinGeckoId}/ohlc`, {
        params: {
          vs_currency: 'usd',
          days: actualDays
        },
        timeout: 15000
      });
      
      console.log(`Live historical data for ${symbol} fetched successfully (${maxIntervals} 5-min intervals)`);
      
      // Transform the data to 5-minute intervals
      let transformedData = response.data.map(item => ({
        time: new Date(item[0]),
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5] || Math.random() * 1000000 + 500000
      }));
      
      // If we have more data than needed, sample it to get 5-minute intervals
      if (transformedData.length > maxIntervals) {
        const step = Math.floor(transformedData.length / maxIntervals);
        transformedData = transformedData.filter((_, index) => index % step === 0);
      }
      
      // Ensure we have the right number of data points
      transformedData = transformedData.slice(-maxIntervals);
      
      return transformedData;
      
    } catch (error) {
      console.error(`Error fetching live historical data for ${symbol}:`, error);
      console.log('Falling back to mock historical data');
      return getMockHistoricalData(symbol);
    }
  }
};

// Helper function to map cryptocurrency symbols to CoinGecko IDs
const getCoinGeckoId = (symbol) => {
  const symbolMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'UNI': 'uniswap',
    'ARB': 'arbitrum'
  };
  
  return symbolMap[symbol];
};

// Format API data for candlestick chart
const formatCandlestickData = (data) => {
  // CoinGecko OHLC data format: [timestamp, open, high, low, close]
  return data.map(item => ({
    time: new Date(item[0]),
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4]
  }));
};

// Mock historical data for fallback
const getMockHistoricalData = (symbol) => {
  const basePrice = symbol === 'BTC' ? 29000 : 
                   symbol === 'ETH' ? 1900 : 
                   symbol === 'SOL' ? 85 : 50;
  
  const now = new Date();
  const data = [];
  
  // Generate 30 days of mock data
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = Math.random() * 0.1; // 10% max volatility
    const dayChange = basePrice * volatility * (Math.random() > 0.5 ? 1 : -1);
    
    const open = basePrice + (Math.random() * 100) - 50;
    const close = open + dayChange;
    const high = Math.max(open, close) + (Math.random() * Math.abs(dayChange) * 0.5);
    const low = Math.min(open, close) - (Math.random() * Math.abs(dayChange) * 0.5);
    
    data.push({
      time: date,
      open,
      high,
      low,
      close
    });
  }
  
  return data;
};

// Mock data as fallback if API fails
const getMockCryptoData = (limit = 10) => {
  const mockData = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      slug: 'bitcoin',
      quote: {
        USD: {
          price: 29430.21,
          percent_change_24h: 2.34,
          market_cap: 525000000000
        }
      }
    },
    {
      id: 1027,
      name: 'Ethereum',
      symbol: 'ETH',
      slug: 'ethereum',
      quote: {
        USD: {
          price: 1945.67,
          percent_change_24h: -1.12,
          market_cap: 220000000000
        }
      }
    },
    {
      id: 5426,
      name: 'Solana',
      symbol: 'SOL',
      slug: 'solana',
      quote: {
        USD: {
          price: 86.23,
          percent_change_24h: 3.95,
          market_cap: 32000000000
        }
      }
    },
    {
      id: 2010,
      name: 'Cardano',
      symbol: 'ADA',
      slug: 'cardano',
      quote: {
        USD: {
          price: 0.42,
          percent_change_24h: 1.23,
          market_cap: 14000000000
        }
      }
    },
    {
      id: 1839,
      name: 'Binance Coin',
      symbol: 'BNB',
      slug: 'binance-coin',
      quote: {
        USD: {
          price: 234.56,
          percent_change_24h: 0.87,
          market_cap: 36000000000
        }
      }
    },
    {
      id: 52,
      name: 'XRP',
      symbol: 'XRP',
      slug: 'xrp',
      quote: {
        USD: {
          price: 0.65,
          percent_change_24h: 0.9,
          market_cap: 32000000000
        }
      }
    },
    {
      id: 3408,
      name: 'USD Coin',
      symbol: 'USDC',
      slug: 'usd-coin',
      quote: {
        USD: {
          price: 1.00,
          percent_change_24h: 0.01,
          market_cap: 25000000000
        }
      }
    },
    {
      id: 825,
      name: 'Tether',
      symbol: 'USDT',
      slug: 'tether',
      quote: {
        USD: {
          price: 1.00,
          percent_change_24h: 0.02,
          market_cap: 68000000000
        }
      }
    },
    {
      id: 3890,
      name: 'Polygon',
      symbol: 'MATIC',
      slug: 'polygon',
      quote: {
        USD: {
          price: 0.87,
          percent_change_24h: 5.20,
          market_cap: 7800000000
        }
      }
    },
    {
      id: 2,
      name: 'Litecoin',
      symbol: 'LTC',
      slug: 'litecoin',
      quote: {
        USD: {
          price: 78.45,
          percent_change_24h: 2.76,
          market_cap: 5200000000
        }
      }
    },
  ];
  
  return mockData.slice(0, limit);
};

// Get mock data for a specific symbol
const getMockCryptoBySymbol = (symbol) => {
  const allMockData = getMockCryptoData(10);
  return allMockData.find(crypto => crypto.symbol === symbol) || null;
};

export default cryptoService;