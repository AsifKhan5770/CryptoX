import { Link } from "react-router-dom"

let Getstart = () => {
    return(
        <>
         <section className="onboarding">
    <div className="container">
      <h2 className="section-title">3 Easy Steps to Start</h2>
      <div className="steps-grid">
        <div className="step">
          <h3>1️⃣ Create Your Wallet</h3>
          <p>Set up a secure crypto wallet to store and manage your assets safely.</p>
        </div>
        <div className="step">
          <h3>2️⃣ Verify Identity</h3>
          <p>Complete KYC verification to ensure regulatory compliance.</p>
        </div>
        <div className="step">
          <h3>3️⃣ Start Trading</h3>
          <p>Buy, sell, and trade cryptocurrencies on CryptoX Web platform instantly.</p>
        </div>
      </div>
      <Link to ="/" className="btn">Back to Home</Link>
    </div>
  </section>
  <section className="market">
  <div className="container">
    <h2 className="section-title">Live Market Overview</h2>
    <div className="market-table">
      <div className="market-row header">
        <div>Coin</div>
        <div>Price</div>
        <div>Change (24h)</div>
        <div>Market Cap</div>
      </div>
      <div className="market-row">
        <div>Bitcoin (BTC)</div>
        <div>$27,450</div>
        <div className="positive">+2.3%</div>
        <div>$525B</div>
      </div>
      <div className="market-row">
        <div>Ethereum (ETH)</div>
        <div>$1,830</div>
        <div className="negative">-1.1%</div>
        <div>$220B</div>
      </div>
      <div className="market-row">
        <div>Ripple (XRP)</div>
        <div>$0.65</div>
        <div className="positive">+0.9%</div>
        <div>$32B</div>
      </div>
    </div>
  </div>
</section>
        </>
    )
}
export default Getstart