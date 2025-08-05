let Topcoins = () => {
  return (
   <>
   <section className="top-ten-coins">
  <div className="container">
    <h2 className="section-title">Top 10 Performing Coins</h2>
    <div className="top-ten-grid">

      {/* Repeat for each coin */}
      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin"/>
          <div>
            <h3>Bitcoin (BTC)</h3>
            <p className="change up">+2.34%</p>
          </div>
        </div>
        <p className="price">$29,430.21</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum"/>
          <div>
            <h3>Ethereum (ETH)</h3>
            <p className="change up">+1.89%</p>
          </div>
        </div>
        <p className="price">$1,945.67</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="Solana"/>
          <div>
            <h3>Solana (SOL)</h3>
            <p className="change up">+3.95%</p>
          </div>
        </div>
        <p className="price">$86.23</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/avalanche-avax-logo.png" alt="Avalanche"/>
          <div>
            <h3>Avalanche (AVAX)</h3>
            <p className="change up">+6.41%</p>
          </div>
        </div>
        <p className="price">$34.12</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="Polygon"/>
          <div>
            <h3>Polygon (MATIC)</h3>
            <p className="change up">+5.20%</p>
          </div>
        </div>
        <p className="price">$0.87</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/litecoin-ltc-logo.png" alt="Litecoin"/>
          <div>
            <h3>Litecoin (LTC)</h3>
            <p className="change up">+2.76%</p>
          </div>
        </div>
        <p className="price">$78.45</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/cardano-ada-logo.png" alt="Cardano"/>
          <div>
            <h3>Cardano (ADA)</h3>
            <p className="change up">+0.87%</p>
          </div>
        </div>
        <p className="price">$0.29</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/chainlink-link-logo.png" alt="Chainlink"/>
          <div>
            <h3>Chainlink (LINK)</h3>
            <p className="change up">+4.10%</p>
          </div>
        </div>
        <p className="price">$12.34</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/uniswap-uni-logo.png" alt="Uniswap"/>
          <div>
            <h3>Uniswap (UNI)</h3>
            <p className="change up">+3.75%</p>
          </div>
        </div>
        <p className="price">$6.57</p>
      </div>

      <div className="coin-item">
        <div className="coin-info">
          <img src="https://cryptologos.cc/logos/arbitrum-arb-logo.png" alt="Arbitrum"/>
          <div>
            <h3>Arbitrum (ARB)</h3>
            <p className="change up">+5.95%</p>
          </div>
        </div>
        <p className="price">$1.12</p>
      </div>

    </div>
  </div>
</section>
   </>             
  );
};
export default Topcoins;
