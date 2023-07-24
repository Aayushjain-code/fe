import React from "react";

const Header = () => {
  return (
    <header style={headerStyle}>
      {/* Your header content goes here */}
      <h1 style={{ margin: "0", padding: "1rem" }}>My Wallet App</h1>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  background: "#007bff",
  color: "#fff",
  textAlign: "center",
};

export default Header;
