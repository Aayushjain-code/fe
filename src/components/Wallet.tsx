import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  SelectChangeEvent,
  Typography,
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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Fetch all wallets
    axios
      .get<WalletData[]>("https://wallet-123.onrender.com//wallets")
      .then((res) => setWallets(res.data));

    const walletId = localStorage.getItem("walletId");
    if (walletId) {
      axios
        .get<WalletData>(`https://wallet-123.onrender.com//wallet/${walletId}`)
        .then((res) => setWallet(res.data));
    }
  }, []);

  const handleWalletChange = (event: SelectChangeEvent<string>) => {
    const walletId = event.target.value as string;
    setSelectedWallet(walletId);
    localStorage.setItem("walletId", walletId);
    window.location.reload();
  };

  const createWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<WalletData>(
        "https://wallet-123.onrender.com//setup",
        {
          balance,
          name,
        }
      );
      console.log(res);
      localStorage.setItem("walletId", res?.data?._id);
      setWallet(res.data);
      enqueueSnackbar("Wallet is created!", { variant: "success" });
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const makeTransaction = async (e: FormEvent) => {
    e.preventDefault();
    const walletId = localStorage.getItem("walletId");
    const transactionAmount =
      transactionType === "CREDIT" ? parseFloat(amount) : -parseFloat(amount);
    await axios.post(`https://wallet-123.onrender.com//transact/${walletId}`, {
      amount: transactionAmount,
      description: transactionType,
    });
    const res = await axios.get<WalletData>(
      `https://wallet-123.onrender.com//wallet/${walletId}`
    );
    setWallet(res.data);
    enqueueSnackbar(
      transactionType === "CREDIT" ? "Amount Credited!" : "Amount Debited",
      { variant: transactionType === "CREDIT" ? "success" : "error" }
    );
  };

  const goToTransactions = () => {
    navigate("/transactions");
  };
  const ClearLocalStorage = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="82vh"
        justifyContent="center"
      >
        <Card
          variant="outlined"
          sx={{ padding: "20px", boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)" }}
        >
          <CardContent>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={ClearLocalStorage} variant="outlined">
                Clear
              </Button>
            </Box>
            {!wallet ? (
              <form onSubmit={createWallet}>
                <Typography
                  variant="h5"
                  component="div"
                  align="center"
                  gutterBottom
                >
                  Wallet Options
                </Typography>
                <Grid container spacing={2} justifyContent="center" mt={2}>
                  <Grid item xs={12}>
                    <TextField
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Wallet Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      label="Initial Balance"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                      Create Wallet
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <div>
                <Typography variant="h5" gutterBottom>
                  {wallet.name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Balance: {wallet.balance?.toFixed(4)}
                </Typography>
                <form onSubmit={makeTransaction}>
                  <TextField
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    label="Transaction Amount"
                    variant="outlined"
                    fullWidth
                  />
                  <ToggleButtonGroup
                    value={transactionType}
                    exclusive
                    onChange={(e: ChangeEvent<{}>, newAlignment: string) => {
                      setTransactionType(newAlignment);
                    }}
                    sx={{ marginY: 2 }}
                  >
                    <ToggleButton value="CREDIT">Credit</ToggleButton>
                    <ToggleButton value="DEBIT">Debit</ToggleButton>
                  </ToggleButtonGroup>
                  <Button type="submit" variant="contained" fullWidth>
                    Execute Transaction
                  </Button>
                  <Button
                    onClick={goToTransactions}
                    variant="contained"
                    fullWidth
                    sx={{ marginY: 2 }}
                  >
                    View Transactions
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Wallet;
