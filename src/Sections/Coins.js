let Coins = () => {
  return (
    <>
      <section className="crypto-coins">
        <div className="container">
          <h2 className="section-title">Top Cryptocurrencies</h2>
          <div className="coin-grid">
            <div className="coin-card">
              <div className="coin-header">
                <img
                  src="https://m.economictimes.com/thumb/msid-79280279,width-1200,height-900,resizemode-4,imgsize-678018/bitcoin.jpg"
                  alt="Bitcoin"
                />
                <h3>
                  Bitcoin <span>(BTC)</span>
                </h3>
              </div>
              <p className="price">$29,430.21</p>
              <div className="chart-bar">
                <div className="chart-line up" style={{ width: "80%" }}></div>
              </div>
              <p className="change up">+2.34%</p>
            </div>

            <div className="coin-card">
              <div className="coin-header">
                <img
                  src="https://cdn.vectorstock.com/i/1000v/69/97/golden-ethereum-coin-symbol-vector-19116997.jpg"
                  alt="Ethereum"
                />
                <h3>
                  Ethereum <span>(ETH)</span>
                </h3>
              </div>
              <p className="price">$1,945.67</p>
              <div className="chart-bar">
                <div className="chart-line down" style={{ width: "50%" }}></div>
              </div>
              <p className="change down">-1.12%</p>
            </div>
            <div className="coin-card">
              <div className="coin-header">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                  alt="Solana"
                />
                <h3>
                  Solana <span>(SOL)</span>
                </h3>
              </div>
              <p className="price">$86.23</p>
              <div className="chart-bar">
                <div className="chart-line up" style={{ width: "60%" }}></div>
              </div>
              <p className="change up">+3.95%</p>
            </div>

            <div className="coin-card">
              <div className="coin-header">
                <img
                  src="https://c8.alamy.com/comp/2G72ACR/cardano-coin-crypto-currency-blockchain-coin-cardano-ada-symbol-vector-illustration-2G72ACR.jpg"
                  alt="Cardano"
                />
                <h3>
                  Cardano <span>(ADA)</span>
                </h3>
              </div>
              <p className="price">$0.29</p>
              <div className="chart-bar">
                <div className="chart-line up" style={{ width: "40%" }}></div>
              </div>
              <p className="change up">+0.87%</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Coins;
