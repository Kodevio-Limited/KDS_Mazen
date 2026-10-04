'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Header from '../../components/Header';
import OrderCard from '../../components/OrderCard';
import QuickSettingsDrawer from '../../components/QuickSettingsDrawer';
import { useQueryModal } from '../../lib/use-query-modal';
import { initialOrders } from '../../data/mockOrders';
import { KitchenOrder, QuickSettings } from '../../types/kds';
import { UtensilsCrossed, PlusCircle } from 'lucide-react';

export default function KitchenDisplayPage() {
  const t = useTranslations();
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  // Query-driven settings drawer: ?modal=settings
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

  // New tickets must be accepted before preparation starts (Bug-56).
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
    if (selectedFilter === 'Delayed')     return order.isDelayed && order.status !== 'COMPLETED';
    if (selectedFilter === 'Completed')   return order.status === 'COMPLETED';
    if (selectedFilter === 'Dine In')     return order.type === 'DINE IN' && order.status !== 'COMPLETED';
    if (selectedFilter === 'Delivery')    return order.type === 'DELIVERY' && order.status !== 'COMPLETED';
    if (selectedFilter === 'Takeaway')    return order.type === 'TAKEAWAY' && order.status !== 'COMPLETED';
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
    'Takeaway': 'takeaway',
    'Delayed': 'delayed',
    'Completed': 'completed',
  };
  const currentFilterKey = filterKeyMap[selectedFilter] || 'allOrders';
  const currentFilterDisplay = t(`header.filters.${currentFilterKey}`);

  const handleAddDemoOrder = () => {
    const nextNum = `#0${orders.length + 45}`;
    const isDineIn = Math.random() > 0.5;
    const newOrd: KitchenOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: nextNum,
      type: isDineIn ? 'DINE IN' : 'DELIVERY',
      tableNumber: isDineIn ? 'Table 02' : undefined,
      tableNumber_ar: isDineIn ? 'طاولة 02' : undefined,
      status: 'PENDING',
      elapsedMinutes: 0,
      elapsedSeconds: 0,
      isDelayed: false,
      createdAt: new Date().toISOString(),
      items: [{
        id: `item-${Date.now()}`,
        name: 'Shoyu Ramen',
        name_ar: 'رامن شويو',
        image: '/images/food-41e5d7.png',
        quantity: 1,
        modifiers: ['Mayo', 'Extra Chili'],
        modifiers_ar: ['مايونيز', 'فلفل حار إضافي'],
        notes: 'Fresh & Hot',
        notes_ar: 'طازج وساخن',
      }],
    };
    setOrders((prev) => [newOrd, ...prev]);
    playChime();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <Header
        activeCount={activeCount}
        delayedCount={delayedCount}
        completedCount={completedCount}
        avgPrepTime={avgPrepTime}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-[1920px] mx-auto w-full">
        {filteredOrders.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white/70 rounded-3xl border border-gray-200/60 max-w-xl mx-auto my-12">
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
              className="px-6 py-2.5 bg-[#026F4F] text-white font-medium rounded-full shadow-sm hover:bg-[#01533B] transition-colors"
            >
              {t('emptyState.showAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 gap-3 items-stretch">
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

      {/* Floating Demo Button */}
      <div className="fixed bottom-6 end-6 z-20">
        <button
          onClick={handleAddDemoOrder}
          className="flex items-center gap-2 bg-white/95 hover:bg-white text-[#026F4F] border border-[#026F4F]/30 hover:border-[#026F4F] px-4 py-2.5 rounded-full shadow-lg font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
          title={t('demoButton')}
        >
          <PlusCircle size={18} />
          <span>{t('demoButton')}</span>
        </button>
      </div>

      <QuickSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}
