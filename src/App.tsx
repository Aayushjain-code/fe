import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Wallet from "./components/Wallet";
import Transactions from "./components/Transactions";

const App = () => {
  console.log("render");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wallet />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
};

export default App;
