'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check } from 'lucide-react';
import { QuickSettings } from '../types/kds';
import { LanguageToggle } from './LanguageToggle';

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
  const t = useTranslations('settings');
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

      {/* Slide-over Drawer Panel — slides from inline-end */}
      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-[619px] bg-[#F2F2F2] shadow-[1px_0px_6.6px_rgba(0,0,0,0.08)] rounded-s-[24px] flex flex-col justify-between p-6 sm:p-8 md:p-10 animate-in slide-in-from-right rtl:slide-in-from-left duration-300">
          {/* Top Section */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-6 sm:pb-8">
              <button
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2D2F33] transition-all hover:bg-gray-100"
                title={t('close')}
                aria-label={t('close')}
              >
                <ArrowLeft size={24} className="rtl:rotate-180" />
              </button>
              <h2 className="text-[26px] sm:text-[33px] font-medium tracking-tight text-[#000000]">{t('title')}</h2>
              <div className="w-12" />
            </div>

            {/* Settings Card */}
            <div className="mt-4 space-y-6 sm:space-y-8 rounded-[13px] border border-gray-100 bg-white p-6 shadow-xs md:p-8">
              {/* Setting 0: Language Toggle (for quick access on all devices & especially mobile) */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('language.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('language.desc')}</p>
                </div>
                <LanguageToggle />
              </div>

              {/* Setting 1: New Order Sound */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('newOrderSound.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('newOrderSound.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.newOrderSound}
                  onClick={() => setLocalSettings({ ...localSettings, newOrderSound: !localSettings.newOrderSound })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.newOrderSound ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[2px] start-[2px] inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${localSettings.newOrderSound ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Setting 2: Show Order Notes */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('showOrderNotes.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('showOrderNotes.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showOrderNotes}
                  onClick={() => setLocalSettings({ ...localSettings, showOrderNotes: !localSettings.showOrderNotes })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.showOrderNotes ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[2px] start-[2px] inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${localSettings.showOrderNotes ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Setting 3: Show Item Modifiers */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('showItemModifiers.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('showItemModifiers.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showItemModifiers}
                  onClick={() => setLocalSettings({ ...localSettings, showItemModifiers: !localSettings.showItemModifiers })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.showItemModifiers ? 'bg-[#2CCE4F]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[2px] start-[2px] inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${localSettings.showItemModifiers ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: Save */}
          <div className="pt-8">
            <button
              onClick={handleSave}
              className="w-full h-[59px] bg-[#026F4F] hover:bg-[#01533B] active:scale-[0.99] text-white font-satoshi font-medium text-[19px] rounded-full shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2"
            >
              {savedNotification ? (
                <>
                  <Check size={22} className="text-white" />
                  <span>{t('saved')}</span>
                </>
              ) : (
                <span>{t('saveChanges')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
