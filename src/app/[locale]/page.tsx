'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Header from '../../components/Header';
import OrderCard from '../../components/OrderCard';
import QuickSettingsDrawer from '../../components/QuickSettingsDrawer';
import { useQueryModal } from '../../lib/use-query-modal';
import { initialOrders } from '../../data/mockOrders';
import { UtensilsCrossed } from 'lucide-react';

export default function KitchenDisplayPage() {
  const t = useTranslations();
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [settingsOpen, setSettingsOpen] = useQueryModal('settings');
  const [settings, setSettings] = useState<QuickSettings>({
    newOrderSound: true,
    showOrderNotes: true,
    showItemModifiers: true,
  });

  const playChime = useCallback(() => {
    if (!settings.newOrderSound) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio context may be restricted before user interaction
    }
  }, [settings.newOrderSound]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === 'COMPLETED') return order;
          let newSec = order.elapsedSeconds + 1;
          let newMin = order.elapsedMinutes;
          if (newSec >= 60) { newSec = 0; newMin += 1; }
          const isDelayed = newMin >= 15;
          return { ...order, elapsedMinutes: newMin, elapsedSeconds: newSec, isDelayed };
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)),
    );
    playChime();
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'PREPARING' } : ord)),
    );
    playChime();
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'All Orders')  return order.status !== 'COMPLETED';
    if (selectedFilter === 'Dine In')     return order.type === 'DINE IN' && order.status !== 'COMPLETED';
    if (selectedFilter === 'Delivery')    return order.type === 'DELIVERY' && order.status !== 'COMPLETED';
    return true;
  });

  const activeCount    = orders.filter((o) => o.status !== 'COMPLETED').length;
  const delayedCount   = orders.filter((o) => o.isDelayed && o.status !== 'COMPLETED').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length + 142;
  const avgPrepTime    = t('header.prepTime', { min: 4, sec: 12 });

  const filterKeyMap: Record<string, string> = {
    'All Orders': 'allOrders',
    'Dine In': 'dineIn',
    'Delivery': 'delivery',
  };
  const currentFilterKey = filterKeyMap[selectedFilter] || 'allOrders';
  const currentFilterDisplay = t(`header.filters.${currentFilterKey}`);

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col font-sans">
      <Header
        activeCount={activeCount >= 4 ? 10 : activeCount}
        delayedCount={delayedCount >= 1 ? 1 : 0}
        completedCount={completedCount}
        avgPrepTime={avgPrepTime}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 p-5 sm:p-6 lg:p-10 max-w-[1920px] mx-auto w-full">
        {filteredOrders.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-gray-200/60 max-w-xl mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-[#989898] mb-4">
              <UtensilsCrossed size={36} />
            </div>
            <h3 className="text-2xl font-bold text-[#2D2F33] mb-2">
              {t('emptyState.title', { filter: currentFilterDisplay })}
            </h3>
            <p className="text-[#6E727A] text-sm max-w-sm mb-6">
              {t('emptyState.subtitle')}
            </p>
            <button
              onClick={() => setSelectedFilter('All Orders')}
              className="px-6 py-2.5 bg-[#026F4F] text-white font-medium rounded-full shadow-sm hover:bg-[#01533B] transition-colors cursor-pointer"
            >
              {t('emptyState.showAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 items-stretch">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                settings={settings}
                onUpdateStatus={handleUpdateStatus}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
              />
            ))}
          </div>
        )}
      </main>

      <QuickSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}
