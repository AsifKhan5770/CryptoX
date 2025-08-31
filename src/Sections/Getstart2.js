import founderImg from '../Assets/founder.jpeg'
let Getstart = () => {
    return(
      <>
      <section className="team">
<div className="container">
<h2 className="section-title">Meet Our Team</h2>
<div className="team-grid">
<div className="team-member">
        <img src={founderImg} alt="Team Member" />
        <h3>Asif Khan</h3>
        <p>CEO & Blockchain Strategist</p>
      </div>
      <div className="team-member">
        <img src="https://via.placeholder.com/150" alt="Team Member" />
        <h3>Amaan Niyazi</h3>
        <p>Lead Smart Contract Developer</p>
      </div>
      <div className="team-member">
        <img src="https://via.placeholder.com/150" alt="Team Member" />
        <h3>John Patel</h3>
        <p>UI/UX & Frontend Engineer</p>
      </div>
    </div>
  </div>
</section>
      </>
    )
}
export default Getstart