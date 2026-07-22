import React from "react";
import { LogIn, Mail } from "lucide-react";
import { AuthHeader, AuthFooterLink, FormInput, PasswordInput } from "../components";
import { useLoginForm } from "../hooks/useLoginForm";
import { useModal, MODAL_TYPES } from "../../../components";

export default function Login() {
  const {
    formData,
    isPassVisible,
    handleChange,
    handleShowPassword,
    handleSubmit,
  } = useLoginForm();
  const { openModal } = useModal();

  return (
    <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
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
          onClick={() => openModal(MODAL_TYPES.SIGNUP)}
        />
      </form>
    </div>
  );
}