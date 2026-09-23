'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Settings } from 'lucide-react';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    'All Orders',
    'Dine In',
    'Delivery',
    'Takeaway',
    'Delayed',
    'Completed',
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white rounded-b-[12px] shadow-sm px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100 sticky top-0 z-30">
      {/* Left: Logo & Active Orders Badge */}
      <div className="flex items-center gap-5">
        <div className="relative w-[131px] h-[38px]">
          <Image
            src="/images/logo-69e842.png"
            alt="Restaurant Ecosystem"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#FFDBDB] px-3.5 py-1.5 text-[16px] font-medium text-[#FF1F1F]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1F1F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF1F1F]"></span>
          </span>
          <span className="font-semibold">{activeCount} Active Orders</span>
        </div>
      </div>

      {/* Center: Live Stats */}
      <div className="hidden items-center gap-12 px-8 py-2.5 lg:flex">
        <div className="flex items-center gap-3">
          <span className="text-[21px] font-normal text-[#989898]">Avg Prep</span>
          <span className="text-[25px] font-medium text-black">
            {avgPrepTime}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[21px] font-normal text-[#989898]">Completed</span>
          <span className="text-[25px] font-medium text-black">
            {completedCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[21px] font-normal text-[#989898]">Delayed</span>
          <span className="flex items-center gap-1.5 text-[25px] font-medium text-black">
            {delayedCount}
          </span>
        </div>
      </div>

      {/* Right: Filter Dropdown & Quick Settings */}
      <div className="flex items-center gap-5">
        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-white border border-[#B9B9B9] hover:border-[#686868] px-5 py-2.5 rounded-full text-[#686868] font-medium text-[16px] transition-all shadow-sm"
          >
            <span>{selectedFilter}</span>
            <ChevronDown
              size={18}
              className={`text-[#686868] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange(opt);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                    selectedFilter === opt
                      ? 'text-[#026F4F] bg-green-50/50 font-semibold'
                      : 'text-[#2D2F33]'
                  }`}
                >
                  {opt}
                  {selectedFilter === opt && (
                    <span className="w-2 h-2 rounded-full bg-[#026F4F]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Settings Gear Button */}
        <button
          onClick={onOpenSettings}
          title="Quick Settings"
          className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-[#026F4F] hover:text-[#026F4F] shadow-sm flex items-center justify-center text-[#686868] transition-all transform hover:scale-105 active:scale-95"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
}
