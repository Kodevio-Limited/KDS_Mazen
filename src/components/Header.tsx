'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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

  const selectedLabel = filterKeys.find((f) => f.value === selectedFilter);
  const displayLabel = selectedLabel ? t(`filters.${selectedLabel.key}`) : selectedFilter;

  return (
    <header className="w-full bg-white rounded-b-[12px] shadow-xs px-6 md:px-10 lg:px-12 py-4 flex items-center justify-between gap-4 border-b border-gray-100 sticky top-0 z-30 min-h-[110px] xl:min-h-[138px]">
      {/* Left: Logo & Active Orders Badge (Stacked Vertically Matching Figma Frame 2147226421) */}
      <div className="flex flex-col items-start gap-2 shrink-0">
        <div className="relative w-[125px] sm:w-[131px] h-[35px] sm:h-[38px] shrink-0">
          <Image
            src="/images/logo-69e842.png"
            alt={t('logoAlt')}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#FFDBDB] px-3.5 py-1 h-[32px] shrink-0">
          <span className="w-[9px] h-[9px] rounded-full bg-[#FF1E1E] shrink-0" />
          <span className="text-[14px] sm:text-[15px] font-medium text-[#FF1E1E] whitespace-nowrap">
            {t('activeOrders', { count: activeCount })}
          </span>
        </div>
      </div>

      {/* Center: Live Stats (Stacked Vertically Matching Figma Frame 2147226420) */}
      <div className="hidden md:flex items-center justify-center gap-8 lg:gap-14 xl:gap-[80px]">
        {/* Avg Prep */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[18px] lg:text-[21px] font-normal text-[#989898] leading-tight">
            {t('avgPrep')}
          </span>
          <span className="text-[22px] lg:text-[25px] font-medium text-black leading-tight mt-1">
            <bdi>{avgPrepTime}</bdi>
          </span>
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[18px] lg:text-[21px] font-normal text-[#989898] leading-tight">
            {t('completed')}
          </span>
          <span className="text-[22px] lg:text-[25px] font-medium text-black leading-tight mt-1">
            <bdi>{completedCount}</bdi>
          </span>
        </div>

        {/* Delayed */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[18px] lg:text-[21px] font-normal text-[#989898] leading-tight">
            {t('delayed')}
          </span>
          <span className="text-[22px] lg:text-[25px] font-medium text-black leading-tight mt-1">
            <bdi>{delayedCount}</bdi>
          </span>
        </div>
      </div>

      {/* Right: Filter Dropdown + Language Switcher + Settings Gear Matching Figma Frame 2147226423 */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Filter Dropdown Matching Figma Frame 33 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white border border-[#B9B9B9] hover:border-[#686868] px-5 py-2.5 h-[50px] sm:h-[53px] rounded-full text-[#686868] font-normal text-[16px] sm:text-[19px] transition-all shadow-xs cursor-pointer"
          >
            <span>{displayLabel}</span>
            <img
              src="/images/weui_arrow-outlined.svg"
              alt=""
              className={`w-[18px] h-[9px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute end-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              {filterKeys.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    onFilterChange(f.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-start px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
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

        {/* Language Toggle */}
        <div className="flex shrink-0 items-center">
          <LanguageToggle />
        </div>

        {/* Quick Settings Gear Matching Figma Group 8 */}
        <button
          onClick={onOpenSettings}
          title={t('quickSettings')}
          aria-label={t('quickSettings')}
          className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#F1F1F1] hover:bg-[#E5E7EB] shadow-xs flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <img src="/images/solar_settings-linear.svg" alt="Settings" className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px]" />
        </button>
      </div>
    </header>
  );
}
