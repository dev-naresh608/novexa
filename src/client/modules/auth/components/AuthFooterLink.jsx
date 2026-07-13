import React from "react";
import { Link } from "react-router-dom";
function AuthFooterLink({ text, linkText, to }) {
  return (
    <div className="text-[#1c1917] text-center">
      <span className="text-gray-600">{text}</span>
      <Link to={to} className="text-[rgb(28,25,23)] font-semibold">
        {linkText}
      </Link>
    </div>
  );
}

export default AuthFooterLink;
