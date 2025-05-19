import React from "react";
import "./Card.css"; // You might not need this if global .card is sufficient

const Card = ({ children, className = "", title, actions }) => {
  return (
    <div className={`custom-card card ${className}`}>
      {" "}
      {/* Combines global .card with custom styles */}
      {title && (
        <div className="custom-card-header">
          <h3 className="custom-card-title">{title}</h3>
          {actions && <div className="custom-card-actions">{actions}</div>}
        </div>
      )}
      <div className="custom-card-body">{children}</div>
    </div>
  );
};

export default Card;
