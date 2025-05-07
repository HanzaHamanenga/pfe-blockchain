import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
   <footer className="footer_pf">
    <div className="container">
        <div className="row">
            <div className="service">
                <h3 className="h3service">Services</h3>
                <ul className="listservice">
                    <li>Internet Computer</li>
                    <li>Blockchain Tech</li>
                    <li>Smart Contracts(Canisters)</li>
                </ul>
            </div>
            <div className="about">
                <h3 className="h3about">About Us</h3>
                <ul className="listservice">
                    <li>Team</li>
                    <li>Company</li>
                </ul>
            </div>
            
        </div>
        <div className="ofer">
                <h3 className="h3ofer">
                    <img src="favicon.ico" alt="" />
                    ICP Verification
                </h3>
                <p className="para">
                We provide a secure and efficient platform for document verification powered by blockchain technology. Our solution allows users to upload, verify, and certify documents with instant NFT issuance, ensuring authenticity, reducing costs, and eliminating the need for third-party verification
                </p>
            </div>
            
            <div  data-aos="zoom-in" class="col item social">
                <a href="#"><i class="fa-brands fa-facebook"></i></a>
                  <a href="#"><i class="fa-brands fa-twitter"></i> </a>
                <a href="#"><i class="fa-brands fa-github"> </i></a>
                  <a href="#"><i class="fa-brands fa-instagram"> </i> </a>
           </div>
        
          <p class="copyright">VericationChain © 2025</p>
        
    </div>

   </footer>
  )
}

export default Footer