import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from './Pages/Home.jsx';
import Cryptos from './Pages/Cryptos.jsx';
import Contact from './Pages/Contact.jsx';
import Navbar from './Sections/Navbar.js';
import Start from './Pages/Start.jsx';
import { HoldingsProvider } from './context/HoldingsContext';

function App() {
  return (
    <HoldingsProvider>
      <div className="App">
        <Navbar/>
        <Routes>
           <Route path = "/" element = {<Home />} />
           <Route path = "/cryptos" element = {<Cryptos />} />
           <Route path = "/contact" element = {<Contact />} />
           <Route path = "/start" element = {<Start />} />
        </Routes>
      </div>
    </HoldingsProvider>
  );
}

export default App;
