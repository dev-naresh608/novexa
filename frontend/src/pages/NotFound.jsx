import React from "react";
import { Link } from "react-router-dom";
import { TriangleAlert, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-stone-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center">
          <TriangleAlert size={40} className="text-stone-700" />
        </div>

        <h1 className="mt-6 text-6xl font-bold text-stone-900">404</h1>

        <h2 className="mt-2 text-2xl font-semibold text-stone-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-stone-500 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <Link
          to="/"
          className="mt-8 w-full bg-[#1c1917] active:scale-95 transition-transform flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}