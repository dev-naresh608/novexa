import React from "react";

function FormInput({
  icon : Icon,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}) {
  return (
    <div>
      <p className="text-[#989da4] text-sm font-semibold ">{label}</p>
      <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
        <Icon className="text-gray-400" size={20} />

        <input
          type={type}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent text-sm "
        />
      </div>
    </div>
  );
}

export default FormInput;
