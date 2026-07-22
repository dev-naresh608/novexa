
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../db";
import { defaultPP } from "@/assets";
import {
  User,
  Mail,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

// ─── Field row ────────────────────────────────────────────────────────────────
const FieldRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F4] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] flex items-center justify-center flex-shrink-0">
      <Icon size={13} className="text-[#78716C]" strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#A8A29E]">{label}</p>
      <p className="text-sm font-semibold text-[#1C1917] truncate">{value}</p>
    </div>
  </div>
);

// Password input with show/hide
const PasswordInput = ({
  placeholder,
  name,
  value,
  onChange,
  isValid = true,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`flex items-center gap-2 bg-[#F5F5F4] border rounded-xl px-3 py-2.5 transition-colors ${
        isValid
          ? "border-[#E7E5E4] focus-within:border-[#6366F1]"
          : "border-[#EF4444]"
      }`}
    >
      <Lock
        size={13}
        className="text-[#A8A29E] flex-shrink-0"
        strokeWidth={2}
      />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="text-[#A8A29E] hover:text-[#78716C] flex-shrink-0"
      >
        {show ? (
          <EyeOff size={13} strokeWidth={2} />
        ) : (
          <Eye size={13} strokeWidth={2} />
        )}
      </button>
    </div>
  );
};

function Setting() {
  const { currentUser, setCurrentUser, setUserData } = useContext(UserContext);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isOldPassMatch, setIsOldPassMatch] = useState(true);
  const [isConfirmPassMatch, setIsConfirmPassMatch] = useState(true);

  // Live validation
  useEffect(() => {
    // only validate old pass when user has typed something
    if (formData.oldPassword.length > 0) {
      setIsOldPassMatch(formData.oldPassword === currentUser.password);
    } else {
      setIsOldPassMatch(true);
    }

    // only validate confirm when user has typed something
    if (formData.confirmPassword.length > 0) {
      setIsConfirmPassMatch(formData.newPassword === formData.confirmPassword);
    } else {
      setIsConfirmPassMatch(true);
    }
  }, [formData.oldPassword, formData.newPassword, formData.confirmPassword]);

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture upload
  const handleImageUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
        await db.localUserData.update(currentUser.id, {
          imageUrl: reader.result,
        });
        setUserData(await db.localUserData.toArray());
        setCurrentUser(await db.localUserData.get(currentUser.id));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  //Remove profile picture
  const handleRemoveProfilePicture = async () => {
    const user = await db.localUserData.get(currentUser.id);
    if (user.hasOwnProperty("imageUrl")) {
      delete user.imageUrl;
      await db.localUserData.put(user);
      setUserData(await db.localUserData.toArray());
      setCurrentUser(await db.localUserData.get(currentUser.id));
    } else {
      toast.error("No custom picture to remove");
    }
  };

  // Submit password change
  const onFormDataSubmit = async (e) => {
    e.preventDefault();

    if (formData.oldPassword !== currentUser.password) {
      toast.error("Current password is incorrect");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }
    if (formData.newPassword.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    await db.localUserData.update(currentUser.id, {
      password: formData.newPassword,
    });
    setUserData(await db.localUserData.toArray());
    setCurrentUser(await db.localUserData.get(currentUser.id));

    toast.success("Password updated successfully!");
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-5 font-sans">
      <ToastContainer
        autoClose={1000}
        // pauseOnHover={false}
        position="top-right"
      />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <h2 className="text-lg font-semibold text-[#1C1917]">Settings</h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">
          Manage your account settings
        </p>
      </div>

      {/* Profile photo */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-4">
          Profile Photo
        </p>
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.imageUrl ?? defaultPP}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#E7E5E4] flex-shrink-0"
          />
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] cursor-pointer hover:text-[#4F46E5] transition-colors">
              <Camera size={13} strokeWidth={2} />
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <button
              type="button"
              onClick={handleRemoveProfilePicture}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors"
            >
              <Trash2 size={13} strokeWidth={2} />
              Remove Photo
            </button>
            <p className="text-[11px] text-[#A8A29E]">JPG, PNG supported</p>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-1">
          Account Info
        </p>
        <FieldRow icon={User} label="Username" value={currentUser.username} />
        <FieldRow icon={Mail} label="Email" value={currentUser.email} />
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-4">
          Change Password
        </p>
        <form onSubmit={onFormDataSubmit} className="space-y-3">
          <div>
            <PasswordInput
              placeholder="Current Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={onPasswordChange}
              isValid={isOldPassMatch}
            />
            {!isOldPassMatch && (
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1">
                Incorrect current password
              </p>
            )}
          </div>

          <PasswordInput
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onPasswordChange}
          />

          <div>
            <PasswordInput
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onPasswordChange}
              isValid={isConfirmPassMatch}
            />
            {!isConfirmPassMatch && (
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1">
                Passwords don't match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-1"
          >
            <CheckCircle2 size={14} strokeWidth={2} />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
