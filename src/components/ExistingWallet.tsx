import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

interface WalletData {
  _id: string;
  name: string;
  balance: number;
}

const ExistingWallet = () => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Fetch all wallets
    axios
      .get<WalletData[]>("https://wallet-123.onrender.com/wallets")
      .then((res) => {
        setWallets(res.data);
      });

    const walletId = localStorage.getItem("walletId");
    if (walletId) {
      axios
        .get<WalletData>(`https://wallet-123.onrender.com/wallet/${walletId}`)
        .then((res) => setWallet(res.data));
    }
  }, []);

  const handleWalletChange = (walletId: string) => {
    setSelectedWallet(walletId);
    localStorage.setItem("walletId", walletId);
    navigate("/wallet");
    window.location.reload();
  };

  const filteredWallets = wallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="76vh"
      padding="20px"
    >
      <Typography variant="h4" gutterBottom>
        Wallets
      </Typography>
      <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        label="Search Wallet"
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: <Search />,
        }}
        style={{ maxWidth: "400px", width: "100%" }}
      />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        mt={2}
        sx={{ overflowY: "scroll", height: "400px", width: "1200px" }}
      >
        {filteredWallets.map((wallet) => (
          <Grid item key={wallet._id}>
            <Card
              sx={{
                width: "200px",
                border: "2px solid black",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={() => handleWalletChange(wallet._id)}
            >
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {wallet.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {wallet.balance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExistingWallet;
