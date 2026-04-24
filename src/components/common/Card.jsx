import React from "react";
import "./Card.css";

const Card = ({ children, className = "", padding = "md", ...rest }) => (
  <div className={`card card--padding-${padding} ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;
