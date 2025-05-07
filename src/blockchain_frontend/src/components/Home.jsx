import React, { useEffect } from 'react';
import './Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
    AOS.refreshHard();

  }, []);
  

  return (
    <>
      <section className='home-section' id='header'>
        <video autoPlay muted loop id="background-video">
          <source src="/backgrnd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="home-content">
          <h1 className='headline'>
            Build <span className="highlight">trust</span> into<br />
            your Organization
          </h1>
          <p className="description">
            Our blockchain-powered platform enables secure document uploads, verification, and<br />
            instant NFT-based certification — ensuring authenticity, transparency, and trust.
          </p>

          <div className="cta">
            <button className='buttn'>
              <a className="btn-verify" href="/verify">Go Verify</a>
            </button>
          </div>
        </div>
      </section>

      <section className="info" data-aos="fade-up">
        
          <div className="row">
            <div className="cost" data-aos="fade-up" data-aos-delay="100">
              <img src="/lowcost.png" alt="Low cost" />
              <h4 className='h4cost'>Less cost</h4>
              <p className="para1">
                We help reduce costs by securely storing and verifying documents on the blockchain, eliminating the need for expensive third-party verification services...
              </p>
            </div>
            <div className="time" data-aos="fade-up" data-aos-delay="200">
              <img src="/fast tra.png" alt="Fast processing" />
              <h4 className='h4time'>Fast Process</h4>
              <p className="para2">
                We ensure fast processing by instantly generating document hashes and verifying them...
              </p>
            </div>
            <div className="secure" data-aos="fade-up" data-aos-delay="300">
              <img src="/doc.png" alt="Secure" />
              <h4 className="h4secure">Secure</h4>
              <p className="para3">
                We prioritize security by leveraging blockchain technology and Internet Identity...
              </p>
            </div>
          </div>
        
      </section>

      <section className="section3" data-aos="fade-up">
  <div className="container3">
    <div className="left-side">
      <img src="man.png" alt="Illustration" />
    </div>

    <div className="right-side">
      <div className="work">
        <h4 className="whatWeDo">What We Do</h4>
        <p className="paraWe">
          We provide a blockchain-based document verification platform that enables secure uploads, verification, and instant NFT certification.
        </p>
      </div>

      <div className="whoWeCanWorkWith">
        <div className="icon-grid">
          <div className="icon-card">
            <i className="fas fa-briefcase fa-2x"></i>
            <h4>UNIVERSITIES</h4>
            <p>Universities can issue and verify certificates on blockchain, preventing forgery.</p>
          </div>

          <div className="icon-card">
            <i className="fas fa-university fa-2x"></i>
            <h4>BANKS</h4>
            <p>Issue tamper-proof loan agreements and verified compliance records.</p>
          </div>

          <div className="icon-card">
            <i className="fas fa-hospital fa-2x"></i>
            <h4>HOSPITALS</h4>
            <p>Secure digital reports, discharge summaries, and vaccination records.</p>
          </div>

          <div className="icon-card">
            <i className="fas fa-building fa-2x"></i>
            <h4>COMPANIES</h4>
            <p>Protect employment letters and policies with blockchain-anchored proof.</p>
          </div>
        </div>
          </div>
        </div>
       </div>
      </section>


    </>
  );
}

export default Home;
