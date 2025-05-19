import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card.jsx";

const NotFoundPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)" /* Adjust for header/footer if any */,
        padding: "20px",
      }}
    >
      <Card
        title="Oops! Page Not Found"
        className="not-found-card"
        style={{ textAlign: "center", maxWidth: "500px" }}
      >
        <div style={{ fontSize: "4em", fontWeight: "bold", margin: "20px 0" }}>
          404
        </div>
        <p style={{ fontSize: "1.2em", marginBottom: "10px" }}>
          We can't seem to find the page you're looking for.
        </p>
        <p style={{ marginBottom: "25px" }}>
          It might have been moved, deleted, or maybe you mistyped the URL.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#646cff" /* Vite purple */,
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "500",
          }}
        >
          Go to Dashboard
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;
