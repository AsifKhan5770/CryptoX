
let Cards = () => {
  return (
   <>
  <section className="features">
  <div className="container">
    <h2 className="section-title">Why Choose CryptoX?</h2>
    <div className="feature-grid">
      <div className="feature-item">
        <h3>🔒 Secure Platform</h3>
        <p>We prioritize security with cutting-edge encryption and decentralized architecture.</p>
      </div>
      <div className="feature-item">
        <h3>⚡ Fast Transactions</h3>
        <p>Experience lightning-fast crypto transactions with minimal fees.</p>
      </div>
      <div className="feature-item">
        <h3>🌐 Global Access</h3>
        <p>Trade anytime, anywhere — CryptoX is accessible worldwide 24/7.</p>
      </div>
    </div>
  </div>
</section>
{/* security section starts */}
<section className="security">
  <div className="container">
    <h2 className="section-title">Your Security is Our Priority 🔐</h2>
    <div className="security-grid">
      <div className="security-point">
        <h3>🛡️ Military-Grade Encryption</h3>
        <p>We use AES-256 encryption to protect your data and assets.</p>
      </div>
      <div className="security-point">
        <h3>🔍 Regular Audits</h3>
        <p>Our smart contracts and infrastructure are regularly audited by top firms.</p>
      </div>
      <div className="security-point">
        <h3>🧑‍💻 Bug Bounty Program</h3>
        <p>Earn rewards by helping us identify and fix vulnerabilities.</p>
      </div>
    </div>
  </div>
</section>
{/* ends */}

{/* User Testimonials / Community Feedback */}
<section class="testimonials">
  <div className="container">
    <h2 className="section-title">What Our Users Say 💬</h2>
    <div className="testimonial-grid">
      <div className="testimonial">
        <p>“CryptoX made trading so simple. I trust them with my portfolio.”</p>
        <h4>— Anjali, Mumbai</h4>
      </div>
      <div className="testimonial">
        <p>“Best crypto UI I’ve ever seen. Clean, fast, and secure.”</p>
        <h4>— Rohan, Bangalore</h4>
      </div>
      <div className="testimonial">
        <p>“Their support team is top-notch. Highly recommended!”</p>
        <h4>— Priya, Delhi</h4>
      </div>
    </div>
  </div>
</section>
{/* ends */}
   </>
  );
};
export default Cards;
