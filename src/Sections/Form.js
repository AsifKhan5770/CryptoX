let Form = () => {
  return (
    <div class="container section-padding">
      <div class="row g-4">
        <div class="col-md-6">
          {/* eslint-disable-next-line */}
          <iframe
            class="map-embed"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.20573097566!2d80.94251274999999!3d26.848692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1755007810455!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div class="col-md-6">
          <h3 class="section-title">Contact Us</h3>
          <form>
            <div class="mb-3">
              <label for="name" class="form-label">
                Your Name
              </label>
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Asif Khan"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">
                Your Email
              </label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="asif@example.com"
              />
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">
                Your Message
              </label>
              <textarea
                class="form-control"
                id="message"
                rows="4"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Form;
