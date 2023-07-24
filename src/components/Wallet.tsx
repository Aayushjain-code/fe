import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface WalletData {
  _id: string;
  name: string;
  balance: number;
}

const Wallet = () => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("CREDIT");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all wallets
    axios
      .get<WalletData[]>("http://localhost:3000/wallets")
      .then((res) => setWallets(res.data));

    const walletId = localStorage.getItem("walletId");
    if (walletId) {
      axios
        .get<WalletData>(`http://localhost:3000/wallet/${walletId}`)
        .then((res) => setWallet(res.data));
    }
  }, []);

  const handleWalletChange = (event: SelectChangeEvent<string>) => {
    const walletId = event.target.value as string;
    setSelectedWallet(walletId);
    localStorage.setItem("walletId", walletId);
    window.location.reload();
  };

  const createWallet = async (e: FormEvent) => {
    e.preventDefault();
    const res = await axios.post<WalletData>("http://localhost:3000/setup", {
      balance,
      name,
    });
    console.log(res);
    localStorage.setItem("walletId", res?.data?._id);
    setWallet(res.data);
  };

  const makeTransaction = async (e: FormEvent) => {
    e.preventDefault();
    const walletId = localStorage.getItem("walletId");
    const transactionAmount =
      transactionType === "CREDIT" ? parseFloat(amount) : -parseFloat(amount);
    await axios.post(`http://localhost:3000/transact/${walletId}`, {
      amount: transactionAmount,
      description: transactionType,
    });
    const res = await axios.get<WalletData>(
      `http://localhost:3000/wallet/${walletId}`
    );
    setWallet(res.data);
  };

  const goToTransactions = () => {
    navigate("/transactions");
  };
  const ClearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div>
      <button onClick={ClearLocalStorage}>Clear</button>
      {!wallet ? (
        <form onSubmit={createWallet}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Wallet Name"
            variant="outlined"
          />
          <TextField
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            label="Initial Balance"
            variant="outlined"
          />
          <Button type="submit" variant="contained">
            Create Wallet
          </Button>
        </form>
      ) : (
        <div>
          <h2>{wallet.name}</h2>
          <h3>Balance: {wallet.balance?.toFixed(4)}</h3>
          <form onSubmit={makeTransaction}>
            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              label="Transaction Amount"
              variant="outlined"
            />
            <ToggleButtonGroup
              value={transactionType}
              exclusive
              onChange={(e: ChangeEvent<{}>, newAlignment: string) => {
                setTransactionType(newAlignment);
              }}
            >
              <ToggleButton value="CREDIT">Credit</ToggleButton>
              <ToggleButton value="DEBIT">Debit</ToggleButton>
            </ToggleButtonGroup>
            <Button type="submit" variant="contained">
              Execute Transaction
            </Button>
          </form>
          <Button onClick={goToTransactions} variant="contained">
            View Transactions
          </Button>
        </div>
      )}

      <div style={{ width: "50%" }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="wallet-select-label">Select Wallet</InputLabel>
          <Select
            labelId="wallet-select-label"
            id="wallet-select"
            value={selectedWallet}
            onChange={handleWalletChange}
            label="Select Wallet"
          >
            {wallets.map((wallet) => (
              <MenuItem key={wallet._id} value={wallet._id}>
                {wallet.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Wallet;
