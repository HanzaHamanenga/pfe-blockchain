import React from 'react'
import './Info.css'


function Info() {
  return (
     // info
     <section className="info">
     <div className="info_container">
       <div className="row">
         <div className="cost">
           <img src="/lowcost.png" alt="" />
           <h4 className='h4cost'>Less cost</h4>
           <p className="para1">We helps reduce costs by securely storing and verifying documents on the blockchain, eliminating the need for expensive third-party verification services. It streamlines the process, saving time and resources for both admins and users</p>
         </div>
         <div className="time">
           <img src="/fast tra.png" alt="" />
           <h4 className='h4time'>Fast Process</h4>
           <p className="para2">We ensure fast processing by instantly generating document hashes and verifying them on the blockchain, allowing our users to confirm authenticity within seconds, without delays or manual intervention</p>
         </div>
         <div className="secure">
           <img src="/doc" alt="" />
           <h4 className="h4secure">Secure</h4>
           <p className="para3">We prioritize security by leveraging blockchain technology and Internet Identity, ensuring that every document is verified with tamper-proof cryptographic hashes and only accessible by authenticated administrators.</p>
         </div>
       </div>
     </div>
   </section>
   
  )
}



export default Info
