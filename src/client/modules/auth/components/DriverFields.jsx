import React from "react";
import { User, Car } from "lucide-react";

export default function DriverFields({ formData, onChange }) {
  return (
    <div className="space-y-4">
      {/* DOB */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Date of Birth</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <User className="text-gray-400" size={20} />

          <input
            required
            type="date"
            name="driver_dob"
            value={formData.driver_dob}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-gray-600 text-sm"
          />
        </div>
      </div>

      {/* VEHICLE NUMBER */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Vehicle Number</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <Car className="text-gray-400" size={20} />

          <input
            required
            type="text"
            name="driver_vehicle_number"
            value={formData.driver_vehicle_number}
            placeholder="Ex: GJ-01-AB-1234"
            onChange={onChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* AADHAAR */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Aadhaar Number</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <User className="text-gray-400" size={20} />

          <input
            required
            type="number"
            name="driver_aadhaar_number"
            value={formData.driver_aadhaar_number}
            placeholder="Enter aadhaar number..."
            onChange={onChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
