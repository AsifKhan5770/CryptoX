import { useState, useEffect, useRef } from "react";

const Form = () => {
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef(null);

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

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  return (
    <div className="contact-section" ref={formRef}>
      <div className="container section-padding">
        <h2 className={`section-title text-center ${isVisible ? "fade-in" : ""}`}>
          Get in <span className="text-gradient">Touch</span>
        </h2>
        <div className="contact-container">
          <div className={`map-container ${isVisible ? "slide-in-left" : ""}`}>
            {/* eslint-disable-next-line */}
            <iframe
              className="map-embed"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.20573097566!2d80.94251274999999!3d26.848692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1755007810455!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              title="Location Map"
            ></iframe>
          </div>
          <div className={`form-container ${isVisible ? "slide-in-right" : ""}`}>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Asif Khan"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="asif@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Write your message..."
                ></textarea>
              </div>
              <button type="submit" className="btn-primary">
                <span>Send Message</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Form;
