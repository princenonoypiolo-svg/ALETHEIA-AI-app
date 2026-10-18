import React, { useState, useRef } from 'react';
import {
  Shield,
  Edit,
  Key,
  Lock,
  CheckCircle2,
  LogOut,
  Sliders,
  Sparkles,
  ArrowLeft,
  Camera,
} from 'lucide-react';
import { OperativeProfile } from '../types';

interface ProfileViewProps {
  operative: OperativeProfile;
  onUpdateOperative: (updated: Partial<OperativeProfile>) => void;
  onOpenEditModal: () => void;
  onOpenPasswordModal: () => void;
  onTerminateSession: () => void;
  onBackToHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  operative,
  onUpdateOperative,
  onOpenEditModal,
  onOpenPasswordModal,
  onTerminateSession,
  onBackToHome,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read the image from device storage as a Data URL
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        onUpdateOperative({ avatarUrl: dataUrl });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerDeviceFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden device file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDeviceImageUpload}
        className="hidden"
        id="device-profile-upload-input"
      />

      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-sm text-[#8c909f] hover:text-[#adc6ff] font-mono-tech transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&lt; RETURN TO ACTIVE SURVEILLANCE</span>
        </button>

        <div className="flex items-center gap-2">
          {uploadSuccess && (
            <span className="text-xs font-mono-tech text-[#4edea3] bg-[#00a572]/20 border border-[#00a572]/40 px-2.5 py-1 rounded animate-fadeIn flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PHOTO UPDATED
            </span>
          )}
          <span className="text-xs font-mono-tech text-[#4edea3] bg-[#00a572]/10 border border-[#00a572]/30 px-2.5 py-1 rounded">
            OPERATIVE CREDENTIALS ACTIVE
          </span>
        </div>
      </div>

      {/* Profile Header Card */}
      <section className="bg-[#112036] border border-[#233554] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4d8eff]/5 to-transparent pointer-events-none"></div>

        {/* Avatar with device photo change trigger */}
        <div className="relative group cursor-pointer" onClick={triggerDeviceFilePicker} title="Click to upload picture from device">
          <div className="relative w-24 h-24 rounded-full border-2 border-[#4d8eff]/40 p-1 flex-shrink-0 shadow-[0_0_20px_rgba(77,142,255,0.2)] overflow-hidden">
            <img
              src={operative.avatarUrl}
              alt={operative.name}
              className="w-full h-full rounded-full object-cover group-hover:opacity-75 transition-opacity"
              referrerPolicy="no-referrer"
            />
            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-[#4d8eff] mb-0.5 animate-bounce" />
              <span className="text-[9px] font-mono-tech text-white font-semibold">CHANGE</span>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#4d8eff] border-2 border-[#112036] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Operative Info */}
        <div className="flex-1 text-center md:text-left space-y-2 z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#d6e3ff] font-['Inter']">
            {operative.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono-tech text-xs text-[#adc6ff] bg-[#4d8eff]/10 px-2.5 py-1 rounded border border-[#4d8eff]/30 tracking-wider">
              CLEARANCE: {operative.clearance}
            </span>
            <span className="font-mono-tech text-xs text-[#c2c6d6] bg-[#27354c] px-2.5 py-1 rounded border border-[#233554]">
              ID: {operative.operativeId}
            </span>
          </div>

          <p className="text-sm text-[#c2c6d6] max-w-lg font-['Inter'] leading-relaxed pt-1">
            {operative.bio}
          </p>
        </div>

        {/* Edit Profile Button */}
        <button
          id="edit-profile-button"
          onClick={onOpenEditModal}
          className="glossy-btn-blue text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 z-10 w-full md:w-auto justify-center cursor-pointer active:scale-95 shadow-md"
        >
          <Edit className="w-4 h-4" />
          <span className="font-['Inter'] font-semibold">Edit Profile</span>
        </button>
      </section>

      {/* Account Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#d6e3ff] border-b border-[#233554] pb-2 font-['Inter']">
          Account Security
        </h2>

        <div className="bg-[#112036] border border-[#233554] rounded-xl divide-y divide-[#233554] shadow-xl">
          {/* Authentication Protocol */}
          <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#d6e3ff] font-['Inter']">
                Authentication Protocol
              </h3>
              <p className="text-sm text-[#c2c6d6] mt-0.5 font-['Inter']">
                Manage your primary cryptographic access credentials.
              </p>
            </div>
            <button
              id="change-password-button"
              onClick={onOpenPasswordModal}
              className="glossy-btn-dark px-4 py-2 rounded-lg text-sm text-[#adc6ff] flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#d6e3ff] border-b border-[#233554] pb-2 font-['Inter']">
          Data Privacy
        </h2>

        <div className="bg-[#112240] border border-[#233554] rounded-xl divide-y divide-[#233554] shadow-xl">
          {/* Telemetry Sharing */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#d6e3ff] font-['Inter']">
                Telemetry Sharing
              </h3>
              <p className="text-sm text-[#c2c6d6] mt-0.5 font-['Inter']">
                Share anonymized scanning data to improve collective network defense.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={operative.telemetrySharing}
                onChange={(e) =>
                  onUpdateOperative({ telemetrySharing: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-[#27354c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4d8eff]"></div>
            </label>
          </div>

          {/* Location Tracking */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#d6e3ff] font-['Inter']">
                Location Tracking
              </h3>
              <p className="text-sm text-[#c2c6d6] mt-0.5 font-['Inter']">
                Allow background location telemetry for geo-fenced vector analysis.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={operative.locationTracking}
                onChange={(e) =>
                  onUpdateOperative({ locationTracking: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-[#27354c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4d8eff]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Terminate Session Button */}
      <div className="flex justify-center pt-4 pb-12 md:pb-6">
        <button
          id="profile-terminate-session-button"
          onClick={onTerminateSession}
          className="glossy-btn-red px-6 py-3 rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </div>
  );
};
