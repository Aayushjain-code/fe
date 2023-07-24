import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
      height="100vh"
    >
      <Card
        variant="outlined"
        sx={{
          padding: "20px",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            Wallet Options
          </Typography>
          <Grid container spacing={2} justifyContent="center" mt={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedirectToNew}
              >
                Create Wallet
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedirectToExisting}
              >
                Choose from Existing Wallet
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
