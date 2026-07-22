import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  name = "password",
  value,
  onChange,
  visible,
  onToggle,
  placeholder = "Password...",
  required = true,
  autoComplete = "current-password",
}) {
  return (
    <div>
      <p className="text-[#989da4] text-sm font-semibold">Password</p>

      <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
        <Lock className="text-gray-400" size={20} />

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
        />

        <button onClick={onToggle} type="button" className="text-[#989da4]">
          {visible ? <Eye size={19} /> : <EyeOff size={19} />}
        </button>
      </div>
    </div>
  );
}
