'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronDown, Settings } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  activeCount: number;
  delayedCount: number;
  completedCount: number;
  avgPrepTime: string;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenSettings: () => void;
}

export default function Header({
  activeCount,
  delayedCount,
  completedCount,
  avgPrepTime,
  selectedFilter,
  onFilterChange,
  onOpenSettings,
}: HeaderProps) {
  const t = useTranslations('header');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterKeys = [
    { key: 'allOrders', value: 'All Orders' },
    { key: 'dineIn',    value: 'Dine In' },
    { key: 'delivery',  value: 'Delivery' },
    { key: 'takeaway',  value: 'Takeaway' },
    { key: 'delayed',   value: 'Delayed' },
    { key: 'completed', value: 'Completed' },
  ] as const;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map English value to translated label for display
  const selectedLabel = filterKeys.find((f) => f.value === selectedFilter);
  const displayLabel = selectedLabel ? t(`filters.${selectedLabel.key}`) : selectedFilter;

  return (
    <header className="w-full bg-white rounded-b-[12px] shadow-sm px-4 sm:px-6 md:px-10 py-3.5 sm:py-5 flex flex-wrap items-center justify-between gap-3 sm:gap-6 border-b border-gray-100 sticky top-0 z-30">
      {/* Start: Logo & Active Orders Badge */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative w-[110px] sm:w-[131px] h-[32px] sm:h-[38px] shrink-0">
          <Image
            src="/images/logo-69e842.png"
            alt={t('logoAlt')}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#FFDBDB] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[14px] sm:text-[16px] font-medium text-[#FF1F1F] shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1F1F] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF1F1F]" />
          </span>
          <span className="font-semibold">{t('activeOrders', { count: activeCount })}</span>
        </div>
      </div>

      {/* Center: Live Stats */}
      <div className="hidden items-center gap-6 xl:gap-12 px-4 lg:px-8 py-2.5 lg:flex">
        <div className="flex items-center gap-2 xl:gap-3">
          <span className="text-[18px] xl:text-[21px] font-normal text-[#989898]">{t('avgPrep')}</span>
          <span className="text-[20px] xl:text-[25px] font-medium text-black"><bdi>{avgPrepTime}</bdi></span>
        </div>
        <div className="flex items-center gap-2 xl:gap-3">
          <span className="text-[18px] xl:text-[21px] font-normal text-[#989898]">{t('completed')}</span>
          <span className="text-[20px] xl:text-[25px] font-medium text-black"><bdi>{completedCount}</bdi></span>
        </div>
        <div className="flex items-center gap-2 xl:gap-3">
          <span className="text-[18px] xl:text-[21px] font-normal text-[#989898]">{t('delayed')}</span>
          <span className="text-[20px] xl:text-[25px] font-medium text-black"><bdi>{delayedCount}</bdi></span>
        </div>
      </div>

      {/* End: Filter Dropdown + Language Toggle (next to Quick Settings) + Quick Settings Gear */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-2.5 bg-white border border-[#B9B9B9] hover:border-[#686868] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[#686868] font-medium text-[14px] sm:text-[16px] transition-all shadow-sm"
          >
            <span>{displayLabel}</span>
            <ChevronDown
              size={18}
              className={`text-[#686868] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute end-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              {filterKeys.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    onFilterChange(f.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-start px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                    selectedFilter === f.value
                      ? 'text-[#026F4F] bg-green-50/50 font-semibold'
                      : 'text-[#2D2F33]'
                  }`}
                >
                  {t(`filters.${f.key}`)}
                  {selectedFilter === f.value && (
                    <span className="w-2 h-2 rounded-full bg-[#026F4F]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Toggle (Desktop / Tablet, placed right next to Quick Settings gear) */}
        <div className="hidden sm:flex shrink-0 items-center">
          <LanguageToggle />
        </div>

        {/* Quick Settings Gear Button */}
        <button
          onClick={onOpenSettings}
          title={t('quickSettings')}
          aria-label={t('quickSettings')}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-gray-200 hover:border-[#026F4F] hover:text-[#026F4F] shadow-sm flex items-center justify-center text-[#686868] transition-all transform hover:scale-105 active:scale-95 shrink-0"
        >
          <Settings size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
    </header>
  );
}
