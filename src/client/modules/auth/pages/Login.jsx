import React from "react";
import { LogIn, Mail } from "lucide-react";
import { AuthHeader, AuthFooterLink, FormInput, PasswordInput } from "../components";
import { useLoginForm } from "../hooks/useLoginForm";

export default function Login() {
  const {
    formData,
    isPassVisible,
    handleChange,
    handleShowPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-sm lg:max-w-md">
        <AuthHeader
          icon={LogIn}
          title="Welcome Back"
          subtitle="Sign in to your account"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            icon={Mail}
            label="Email Address"
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            value={formData.password}
            onChange={handleChange}
            visible={isPassVisible}
            onToggle={handleShowPassword}
          />

          <button
            type="submit"
            className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-2 rounded-lg font-semibold"
          >
            <LogIn size={20} /> Sign In
          </button>

          <AuthFooterLink
            text="Don't have an account?"
            linkText="Sign up"
            to="/signup"
          />
        </form>
      </div>
    </div>
  );
}