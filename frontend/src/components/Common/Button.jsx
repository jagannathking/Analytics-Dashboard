import React from "react";
import "./Button.css"; // Styles specific to this custom button

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // e.g., primary, secondary, danger, link
  size = "medium", // e.g., small, medium, large
  disabled = false,
  isLoading = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`custom-btn custom-btn-${variant} custom-btn-${size} ${
        isLoading ? "loading" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true"></span>
      ) : (
        children
      )}
      {isLoading && <span className="sr-only">Loading...</span>}
    </button>
  );
};

export default Button;
