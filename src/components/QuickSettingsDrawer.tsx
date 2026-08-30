'use client';

import React, { useState } from 'react';
import { ArrowLeft, X, Check, Volume2 } from 'lucide-react';
import { QuickSettings } from '../types/kds';

interface QuickSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: QuickSettings;
  onSaveSettings: (newSettings: QuickSettings) => void;
}

export default function QuickSettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: QuickSettingsDrawerProps) {
  const [localSettings, setLocalSettings] = useState<QuickSettings>(settings);
  const [savedNotification, setSavedNotification] = useState(false);

  // Sync state when drawer opens
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[619px] bg-[#F2F2F2] shadow-[1px_0px_6.6px_rgba(0,0,0,0.08)] rounded-l-[24px] flex flex-col justify-between p-8 md:p-10 animate-in slide-in-from-right duration-300">
          {/* Top Section: Header & Settings Card */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-8">
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-[#2D2F33] transition-all transform hover:scale-105"
                title="Close"
              >
                <ArrowLeft size={24} />
              </button>

              <h2 className="text-[33px] font-bold text-[#000000] tracking-tight">
                Quick Settings
              </h2>

              <div className="w-12" /> {/* Placeholder to balance center header */}
            </div>

            {/* White Settings Card */}
            <div className="bg-white rounded-[13px] p-6 md:p-8 shadow-xs space-y-8 mt-4 border border-gray-100">
              {/* Setting 1: New Order Sound */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[19px] font-bold text-[#000000]">
                    New Order Sound
                  </h3>
                  <p className="text-[13px] text-[#989898]">
                    Play tone for new tickets
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.newOrderSound}
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      newOrderSound: !localSettings.newOrderSound,
                    })
                  }
                  className={`relative inline-flex h-[28px] w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    localSettings.newOrderSound ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      localSettings.newOrderSound ? 'translate-x-[24px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="border-b border-gray-100" />

              {/* Setting 2: Show Order Notes */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[19px] font-bold text-[#000000]">
                    Show Order Notes
                  </h3>
                  <p className="text-[13px] text-[#989898]">
                    Display customer requests
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showOrderNotes}
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      showOrderNotes: !localSettings.showOrderNotes,
                    })
                  }
                  className={`relative inline-flex h-[28px] w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    localSettings.showOrderNotes ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      localSettings.showOrderNotes ? 'translate-x-[24px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="border-b border-gray-100" />

              {/* Setting 3: Show Item Modifiers */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[19px] font-bold text-[#000000]">
                    Show Item Modifiers
                  </h3>
                  <p className="text-[13px] text-[#989898]">
                    e.g. Mayo, ExtraChili
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showItemModifiers}
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      showItemModifiers: !localSettings.showItemModifiers,
                    })
                  }
                  className={`relative inline-flex h-[28px] w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    localSettings.showItemModifiers ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      localSettings.showItemModifiers ? 'translate-x-[24px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action: Save Changes Button */}
          <div className="pt-8">
            <button
              onClick={handleSave}
              className="w-full h-[59px] bg-[#026F4F] hover:bg-[#01533B] active:scale-[0.99] text-white font-medium text-[19px] rounded-full shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2"
            >
              {savedNotification ? (
                <>
                  <Check size={22} className="text-white" />
                  <span>Saved Successfully</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
