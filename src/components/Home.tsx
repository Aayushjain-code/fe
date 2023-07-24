import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";
const Home = () => {
  const navigate = useNavigate();

  const handleRedirectToExisting = () => {
    navigate("/existingwallets");
  };

  const handleRedirectToNew = () => {
    localStorage.clear();
    navigate("/wallet");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Card
        // variant="outlined"
        sx={{
          padding: "20px",
          boxShadow: "0px 4px 16px rgba(106, 103, 103, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            Wallet Options
          </Typography>
          <Grid container spacing={2} justifyContent="center" mt={2}>
            <Grid
              item
              sx={{
                padding: "20px",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                width: "150px",
                margin: "20px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleRedirectToNew}
            >
              <AccountBalanceWalletIcon fontSize="large" />
              <Typography variant="body1">Create Wallet</Typography>
            </Grid>
            <Grid
              item
              sx={{
                padding: "20px",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                width: "150px",
                margin: "20px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleRedirectToExisting}
            >
              <SearchIcon fontSize="large" />
              <Typography variant="body1" fontSize={15}>
                Find Existing
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
