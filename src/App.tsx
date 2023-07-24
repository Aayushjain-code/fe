import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Wallet from "./components/Wallet";
import Transactions from "./components/Transactions";
import Home from "./components/Home";
import ExistingWallet from "./components/ExistingWallet";

const App = () => {
  console.log("render");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/existingwallets" element={<ExistingWallet />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
};

export default App;
