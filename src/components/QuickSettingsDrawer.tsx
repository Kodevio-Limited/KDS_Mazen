'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
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

      {/* Slide-over Drawer Panel Matching Figma Frame 1696:72826 */}
      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-[619px] bg-[#F1F1F1] shadow-[1px_0px_6.6px_rgba(0,0,0,0.08)] rounded-s-[24px] flex flex-col justify-between p-6 sm:p-8 md:p-10 animate-in slide-in-from-right rtl:slide-in-from-left duration-300">
          {/* Top Section */}
          <div>
            {/* Header Matching Figma with centered title */}
            <div className="relative flex items-center justify-center pb-6 sm:pb-8">
              <button
                onClick={onClose}
                className="absolute start-0 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#E9E9E9] hover:bg-[#dedede] text-[#2D2F33] transition-all cursor-pointer shrink-0"
                title={t('close')}
                aria-label={t('close')}
              >
                <img
                  src="/images/solar_arrow-up-linear.svg"
                  alt="Back"
                  className="w-6 h-6 rtl:rotate-180"
                />
              </button>
              <h2 className="text-[28px] sm:text-[33px] font-medium tracking-tight text-[#000000]">
                {t('title')}
              </h2>
            </div>

            {/* Settings Card Matching Figma Frame 2147226464 */}
            <div className="mt-2 space-y-6 sm:space-y-7 rounded-[13px] border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-xs">
              {/* Setting 1: New Order Sound */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('newOrderSound.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('newOrderSound.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.newOrderSound}
                  onClick={() => setLocalSettings({ ...localSettings, newOrderSound: !localSettings.newOrderSound })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.newOrderSound ? 'bg-[#2BCD4E]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[3.5px] start-[3.5px] inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${localSettings.newOrderSound ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Setting 2: Show Order Notes */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('showOrderNotes.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('showOrderNotes.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showOrderNotes}
                  onClick={() => setLocalSettings({ ...localSettings, showOrderNotes: !localSettings.showOrderNotes })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.showOrderNotes ? 'bg-[#2BCD4E]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[3.5px] start-[3.5px] inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${localSettings.showOrderNotes ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Setting 3: Show Item Modifiers */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('showItemModifiers.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('showItemModifiers.desc')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings.showItemModifiers}
                  onClick={() => setLocalSettings({ ...localSettings, showItemModifiers: !localSettings.showItemModifiers })}
                  className={`relative inline-flex h-[24px] w-[49px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${localSettings.showItemModifiers ? 'bg-[#2BCD4E]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`pointer-events-none absolute top-[3.5px] start-[3.5px] inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${localSettings.showItemModifiers ? 'translate-x-[25px] rtl:-translate-x-[25px]' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Setting: Language Toggle */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                <div className="space-y-0.5">
                  <h3 className="text-[17px] sm:text-[19px] font-medium text-[#000000]">{t('language.label')}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#989898]">{t('language.desc')}</p>
                </div>
                <LanguageToggle />
              </div>
            </div>
          </div>

          {/* Bottom: Save Changes Button Matching Figma Frame 2147226463 */}
          <div className="pt-8">
            <button
              onClick={handleSave}
              className="w-full h-[59px] bg-[#026F4F] hover:bg-[#01533B] active:scale-[0.99] text-white font-medium text-[19px] rounded-full shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
