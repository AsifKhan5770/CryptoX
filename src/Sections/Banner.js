import { Link } from "react-router-dom";

let Banner = () => {
  return (
    <>
     <section className="banner">
  <div className="banner-overlay"></div>
  <div className="banner-content animate__fade-in">
    <h1>
      Welcome to <span>CryptoX Exchange</span>
    </h1>
    <p>Your Gateway to the Future of Decentralized Finance</p>
    <Link to ="/start" className="btn animate__bounce-in">
      Get Started
    </Link>
  </div>
</section>

      {/*  Buy & Sell Section */}
      <section className="buy-sell">
        <div className="container">
          <h2 className="section-title">Buy & Sell Crypto Instantly</h2>
          <div className="buy-sell-grid">
            {/* Buy Box */}
            <div className="buy-box">
              <h3>Buy Crypto</h3>
              <form id="buy-form">
                <label for="buy-coin">Select Coin</label>
                <select id="buy-coin">
                  <option value="BTC" data-rate="29430.21">
                    Bitcoin (BTC)
                  </option>
                  <option value="ETH" data-rate="1945.67">
                    Ethereum (ETH)
                  </option>
                  <option value="SOL" data-rate="86.23">
                    Solana (SOL)
                  </option>
                </select>

                <label for="buy-amount">Amount (USD)</label>
                <input type="number" id="buy-amount" placeholder="$100" />

                <p className="estimate">
                  You’ll receive: <span id="buy-estimate">0</span> coins
                </p>

                <button type="submit" className="btn">
                  Buy Now
                </button>
              </form>
            </div>

            {/*  Sell Box */}
            <div className="sell-box">
              <h3>Sell Crypto</h3>
              <form id="sell-form">
                <label for="sell-coin">Select Coin</label>
                <select id="sell-coin">
                  <option value="BTC" data-rate="29430.21">
                    Bitcoin (BTC)
                  </option>
                  <option value="ETH" data-rate="1945.67">
                    Ethereum (ETH)
                  </option>
                  <option value="SOL" data-rate="86.23">
                    Solana (SOL)
                  </option>
                </select>

                <label for="sell-amount">Amount (in Coin)</label>
                <input type="number" id="sell-amount" placeholder="0.01" />

                <p className="estimate">
                  You’ll receive: <span id="sell-estimate">$0</span>
                </p>

                <button type="submit" className="btn alt">
                  Sell Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Banner;
