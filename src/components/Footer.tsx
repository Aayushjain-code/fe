import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* Your footer content goes here */}
      <p style={{ margin: "0", padding: "1rem" }}>
        &copy; {new Date().getFullYear()} My Wallet App. All rights reserved.
      </p>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  background: "#f0f0f0",
  color: "#333",
  textAlign: "center",
};

export default Footer;
