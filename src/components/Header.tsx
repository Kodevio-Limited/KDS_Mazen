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

  // Live stats — one compact block. `compact` is used for the tablet strip row.
  const renderStats = (compact = false) => (
    <>
      <div className={`flex shrink-0 items-center whitespace-nowrap ${compact ? 'gap-2' : 'gap-1.5 2xl:gap-3'}`}>
        <span className={`${compact ? 'text-[16px]' : 'text-[17px] 2xl:text-[21px]'} font-normal text-[#989898]`}>{t('avgPrep')}</span>
        <span className={`${compact ? 'text-[18px]' : 'text-[19px] 2xl:text-[25px]'} font-medium text-black`}><bdi>{avgPrepTime}</bdi></span>
      </div>
      <div className={`flex shrink-0 items-center whitespace-nowrap ${compact ? 'gap-2' : 'gap-1.5 2xl:gap-3'}`}>
        <span className={`${compact ? 'text-[16px]' : 'text-[17px] 2xl:text-[21px]'} font-normal text-[#989898]`}>{t('completed')}</span>
        <span className={`${compact ? 'text-[18px]' : 'text-[19px] 2xl:text-[25px]'} font-medium text-black`}><bdi>{completedCount}</bdi></span>
      </div>
      <div className={`flex shrink-0 items-center whitespace-nowrap ${compact ? 'gap-2' : 'gap-1.5 2xl:gap-3'}`}>
        <span className={`${compact ? 'text-[16px]' : 'text-[17px] 2xl:text-[21px]'} font-normal text-[#989898]`}>{t('delayed')}</span>
        <span className={`${compact ? 'text-[18px]' : 'text-[19px] 2xl:text-[25px]'} font-medium text-black`}><bdi>{delayedCount}</bdi></span>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white px-4 py-3 shadow-sm rounded-b-[12px] sm:px-6 sm:py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {/* Start: Logo & Active Orders Badge */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
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

        {/* Live stats — tablet/laptop: own centered strip row (order-last keeps the controls on row 1) */}
        <div className="order-last hidden w-full shrink-0 items-center justify-center gap-6 border-t border-gray-100 pt-3 sm:flex xl:hidden">
          {renderStats(true)}
        </div>

        {/* Live stats — desktop: centered on the same row */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 px-2 2xl:gap-10 xl:flex">
          {renderStats()}
        </div>

        {/* End: Filter Dropdown + Language Toggle + Quick Settings Gear */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 sm:gap-2.5 bg-white border border-[#B9B9B9] hover:border-[#686868] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[#686868] font-medium text-[14px] sm:text-[16px] transition-all shadow-sm"
            >
              <span>{displayLabel}</span>
              <ChevronDown
                size={18}
                className={`text-[#686868] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute end-0 mt-2 w-48 max-w-[calc(100vw-2rem)] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
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
      </div>
    </header>
  );
}
