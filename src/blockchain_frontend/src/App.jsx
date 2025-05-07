import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { blockchain_backend } from 'declarations/blockchain_backend';
import Navbar from './components/navbar'; 
import Home from './components/Home';
import Admin from './components/Admin';
import Verify from './components/Verify';
import Info from './components/Info';
import Footer from './components/Footer';

function App() {
const principalId = "bd3sg-teaaa-aaaaa-qaaba-cai";
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/verify' element={<Verify id={principalId} />} />
        <Route path='/Admin' element={<Admin id={principalId} />} />
      </Routes>
      <Footer />
      
    </BrowserRouter>
   
  );
}

export default App;
