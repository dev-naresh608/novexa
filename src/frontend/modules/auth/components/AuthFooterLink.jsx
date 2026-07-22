import React from "react";
import { Link } from "react-router-dom";
function AuthFooterLink({ text, linkText, to, onClick }) {
  return (
    <div className="text-[#1c1917] text-center">
      <span className="text-gray-600">{text}</span>{" "}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="text-[rgb(28,25,23)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer outline-none"
        >
          {linkText}
        </button>
      ) : (
        <Link to={to} className="text-[rgb(28,25,23)] font-semibold">
          {linkText}
        </Link>
      )}
    </div>
  );
}

export default AuthFooterLink;
