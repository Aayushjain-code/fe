import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Wallet from "./components/Wallet";
import Transactions from "./components/Transactions";
import Home from "./components/Home";
import ExistingWallet from "./components/ExistingWallet";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  console.log("render");
  return (
    <Router>
      <Header /> {/* Include the header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/existingwallets" element={<ExistingWallet />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
      <Footer /> {/* Include the footer component */}
    </Router>
  );
};

export default App;
