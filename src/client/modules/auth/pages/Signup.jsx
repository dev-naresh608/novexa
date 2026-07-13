import React from "react";
import { UserPlus2Icon, User, Phone, Mail } from "lucide-react";
import {
  AuthHeader,
  AuthFooterLink,
  FormInput,
  PasswordInput,
  RoleSelector,
  SellerFields,
  DriverFields,
} from "../components";
import { useSignupForm } from "../hooks/useSignupForm";
import { STORE_CATEGORIES } from "../constants/storeCategories";

export default function Signup() {
  const {
    formData,
    currentRole,
    setCurrentRole,
    isPassVisible,
    handleChange,
    handleShowPassword,
    handleSubmit,
  } = useSignupForm();

  return (
    <div className="p-10 flex justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <AuthHeader
          icon={UserPlus2Icon}
          title="Create account"
          subtitle="Join us today"
        />

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <RoleSelector currentRole={currentRole} onChange={setCurrentRole} />

          <FormInput
            icon={User}
            label="Username"
            name="username"
            type="text"
            placeholder="Username..."
            value={formData.username}
            onChange={handleChange}
            required
          />

          <FormInput
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            placeholder="Email..."
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

          <FormInput
            icon={Phone}
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number..."
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {currentRole === "seller" && (
            <SellerFields
              formData={formData}
              onChange={handleChange}
              categories={STORE_CATEGORIES}
            />
          )}

          {currentRole === "driver" && (
            <DriverFields formData={formData} onChange={handleChange} />
          )}

          <button
            type="submit"
            className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold"
          >
            <UserPlus2Icon size={20} />
            Create Account
          </button>

          <AuthFooterLink
            text="Already have an account?"
            linkText="Sign in"
            to="/login"
          />
        </form>
      </div>
    </div>
  );
}
