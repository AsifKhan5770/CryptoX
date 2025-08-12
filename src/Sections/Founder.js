import founderImg from '../Assets/founder.jpeg'
let Founder = () => {
    return(
        <>
        <section className="founder-section">
      <div className="container founder-container">
        <div className="founder-image-box">
          <img src={founderImg} alt="Asif Khan - Founder" className="founder-img" />
        </div>
        <div className="founder-info">
          <h2 className="founder-name">Asif Khan</h2>
          <p className="founder-role">Founder & MERN Developer</p>
          <p className="founder-desc">
            I'm the visionary behind CryptoX. I build powerful, secure, and scalable
            blockchain-powered web experiences using the MERN stack. Let’s reshape the
            future of finance together!
          </p>
        </div>
      </div>
    </section>
        </>
    )
}
export default Founder