
import { useState, useEffect, useRef } from "react";

let Cards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: "🔒",
      title: "Secure Platform",
      description: "We prioritize security with cutting-edge encryption and decentralized architecture.",
      delay: 0,
      color: "#00ffee"
    },
    {
      icon: "⚡",
      title: "Fast Transactions",
      description: "Experience lightning-fast crypto transactions with minimal fees.",
      delay: 200,
      color: "#00bfff"
    },
    {
      icon: "🌐",
      title: "Global Access",
      description: "Trade anytime, anywhere — CryptoX is accessible worldwide 24/7.",
      delay: 400,
      color: "#ffae00"
    },
    {
      icon: "💰",
      title: "Low Fees",
      description: "Enjoy some of the lowest trading fees in the crypto market.",
      delay: 600,
      color: "#00ff7f"
    }
  ];

  return (
    <>
      <section className="features" ref={sectionRef}>
        <div className="container">
          <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>
            Why Choose <span className="text-gradient">CryptoX</span>?
          </h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${isVisible ? "visible" : ""}`}
                style={{ 
                  transitionDelay: `${feature.delay}ms`,
                  '--feature-color': feature.color
                }}
              >
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-bg-circle"></div>
              </div>
            ))}
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
<section className="testimonials">
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
