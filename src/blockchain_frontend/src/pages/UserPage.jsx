import React from 'react';
import Card0 from '../Components/Card0';
import Card1 from '../Components/Card1';
import Card2 from '../Components/Card2';
import Footer from '../Components/Footer';
import BlockchainBackground from './BlockchainBackgroung';
import './UserPage.css';

const UserPage = () => {
  return (
    <div className='App'>
     <BlockchainBackground />
        <Card0 />
        <Card1 />
        <Card2 />
        <Footer />

      
    </div>
  )
}

export default UserPage;
