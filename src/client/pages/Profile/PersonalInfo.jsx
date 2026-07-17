import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddressContext, UserContext } from "../../contexts/context";
import { useModal, MODAL_TYPES } from "../../components";
import { db } from "../../db";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Pencil,
  Trash2,
  PlusCircle,
  ChevronRight,
} from "lucide-react";

// ─── Info card ────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, value, accent = "#6366F1" }) => (
  <div className="bg-white rounded-2xl border border-[#E7E5E4] p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: accent + "18" }}
    >
      <Icon size={16} style={{ color: accent }} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#A8A29E] font-medium">{label}</p>
      <p className="text-sm font-semibold text-[#1C1917] truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

function PersonalInfo() {
  const { currentUser, setCurrentUser, setUserData, setActiveTab } =
    useContext(UserContext);
  const navigate = useNavigate();
  const { openModal } = useModal();

  let isAddressAvail = currentUser.hasOwnProperty("myAddress");
  const addr = isAddressAvail ? currentUser.myAddress : null;
  const fullAddress = addr
    ? `${addr.street}, ${addr.city}, ${addr.state} – ${addr.pincode}`
    : null;

  useEffect(() => setActiveTab("personalinformation"), []);

  const onDeleteAddress = () => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Delete Address",
      message: "Are you sure you want to delete your saved address?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const user = await db.localUserData.get(currentUser.id);
        delete user.myAddress;
        await db.localUserData.put(user);
        setUserData(await db.localUserData.toArray());
        setCurrentUser(await db.localUserData.get(currentUser.id));
      }
    });
  };

  const onAddOrEditAddress = () => {
    openModal(MODAL_TYPES.ADDRESS, {
      userId: currentUser.id,
      setAddress: async (newAddress) => {
        const user = await db.localUserData.get(currentUser.id);
        user.myAddress = newAddress;
        await db.localUserData.put(user);
        setUserData(await db.localUserData.toArray());
        setCurrentUser(await db.localUserData.get(currentUser.id));
      }
    });
  };

  const totalOrders = currentUser?.myOrders?.length || 0;

  return (
    <div className="bg-white h-full rounded-2xl border border-[#E7E5E4] p-6 space-y-6 font-sans">
      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-semibold text-[#1C1917]">
          Personal Information
        </h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">
          Manage your personal details
        </p>
      </div>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoCard
          icon={User}
          label="Username"
          value={currentUser.username}
          accent="#6366F1"
        />
        <InfoCard
          icon={Mail}
          label="Email"
          value={currentUser.email}
          accent="#10B981"
        />
        {currentUser.phone && (
          <InfoCard
            icon={Phone}
            label="Phone"
            value={`+91 ${currentUser.phone}`}
            accent="#F59E0B"
          />
        )}
      </div>

      {/* ── Orders summary ── */}
      {currentUser.role === "customer" && (
        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingBag
                size={16}
                className="text-amber-500"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-xs text-[#A8A29E]">Total Orders</p>
              <p className="text-xl font-semibold text-[#1C1917]">
                {totalOrders}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab("orders");
              navigate("/orders");
            }}
            className="flex items-center gap-1 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            View Orders <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── Address section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1C1917]">
            Saved Address
          </h3>
        </div>

        {isAddressAvail ? (
          <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={15} className="text-[#78716C]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                {addr.name && (
                  <p className="text-sm font-semibold text-[#1C1917]">
                    {addr.name}
                  </p>
                )}
                {addr.phone && (
                  <p className="text-xs text-[#78716C] mt-0.5">
                    +91 {addr.phone}
                  </p>
                )}
                <p className="text-sm text-[#78716C] mt-1 leading-snug">
                  {fullAddress}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F5F5F4]">
              <button
                onClick={onAddOrEditAddress}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
              >
                <Pencil size={12} strokeWidth={2} /> Edit
              </button>
              <span className="text-[#E7E5E4]">|</span>
              <button
                onClick={onDeleteAddress}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors"
              >
                <Trash2 size={12} strokeWidth={2} /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAF9] border border-dashed border-[#E7E5E4] rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] flex items-center justify-center mx-auto mb-3">
              <MapPin size={18} className="text-[#A8A29E]" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[#78716C] font-medium">
              No address saved yet
            </p>
            <button
              onClick={onAddOrEditAddress}
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors"
            >
              <PlusCircle size={13} strokeWidth={2} /> Add Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalInfo;
