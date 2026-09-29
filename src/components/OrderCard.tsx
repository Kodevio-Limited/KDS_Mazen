'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ReceiptText, Clock } from 'lucide-react';
import { KitchenOrder, QuickSettings } from '../types/kds';

interface OrderCardProps {
  order: KitchenOrder;
  settings: QuickSettings;
  onUpdateStatus: (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => void;
}

export default function OrderCard({ order, settings, onUpdateStatus }: OrderCardProps) {
  const t = useTranslations('orderCard');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const isPreparing = order.status === 'PREPARING';
  const isReady = order.status === 'READY';
  const isCompleted = order.status === 'COMPLETED';

  const formatTimer = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getTimerStyles = () => {
    if (order.isDelayed || order.elapsedMinutes >= 15) {
      return 'bg-[#FFD2D2] border-[#F85959] text-[#E52B2B]';
    }
    if (order.elapsedMinutes >= 8) {
      return 'bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]';
    }
    return 'bg-[#DCFCE7] border-[#22C55E] text-[#15803D]';
  };

  const getTypeBadgeStyles = () => {
    return 'bg-[#F2F2F2] border-[#B9B9B9] text-[#000000]';
  };

  const renderTableLabel = () => {
    if (!order.tableNumber) return null;
    const raw = isAr && order.tableNumber_ar ? order.tableNumber_ar : order.tableNumber;
    const match = raw.match(/^(?:Table|طاولة)\s*(.+)$/i);
    if (match) {
      return (
        <span>
          {' • '}{isAr ? 'طاولة ' : 'Table '}<bdi>{match[1]}</bdi>
        </span>
      );
    }
    return (
      <span>
        {' • '}<bdi>{raw}</bdi>
      </span>
    );
  };

  return (
    <div className="w-full max-w-[445px] bg-white rounded-[21px] p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      {/* Top Section: Order Header */}
      <div>
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-bold text-[#000000] tracking-tight">
              <bdi>{order.orderNumber}</bdi>
            </span>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getTypeBadgeStyles()}`}>
              {t(`types.${order.type}`)}
              {renderTableLabel()}
            </div>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-2xl border font-bold text-[14px] flex items-center gap-1.5 shadow-xs ${getTimerStyles()}`}
          >
            <Clock size={15} className="shrink-0" />
            <span>
              <bdi>{formatTimer(order.elapsedMinutes, order.elapsedSeconds)}</bdi>
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const displayName = isAr && item.name_ar ? item.name_ar : item.name;
            const displayModifiers = isAr && item.modifiers_ar ? item.modifiers_ar : item.modifiers;
            const displayNotes = isAr && item.notes_ar ? item.notes_ar : item.notes;

            return (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4">
                    {/* Food Image Box */}
                    <div className="relative w-[89px] h-[98px] rounded-[8px] bg-[#F2F2F2] overflow-hidden shrink-0 flex items-center justify-center p-2 border border-gray-100">
                      <Image
                        src={item.image}
                        alt={displayName}
                        width={68}
                        height={68}
                        className="object-contain transform hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <h4 className="text-[20px] font-medium leading-snug text-[#2D2F33]">
                        {displayName}
                      </h4>

                      {/* Modifiers */}
                      {settings.showItemModifiers && displayModifiers && displayModifiers.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          {displayModifiers.map((mod, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-[#989898]"
                            >
                              <span className="text-[18px] font-normal text-[#2DC35F]">+</span>
                              {mod}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special Instructions Note */}
                      {settings.showOrderNotes && displayNotes && (
                        <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium italic text-[#026F4F]">
                          <ReceiptText size={20} className="shrink-0" />
                          <span>{displayNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity */}
                  <div className="shrink-0 pt-0.5 text-end">
                    <span className="text-[18.7px] font-semibold text-[#026F4F]">
                      {t('qty', { qty: item.quantity })}
                    </span>
                  </div>
                </div>

                {/* Dashed divider between items */}
                {idx < order.items.length - 1 && (
                  <div className="w-full border-b border-dashed border-[#B9B9B9] my-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Status Action Button */}
      <div className="mt-auto pt-6">
        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-[54px] bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-medium text-[16px] rounded-full shadow-[0px_4px_16px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('markReady')}</span>
          </button>
        )}

        {isReady && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full h-[54px] bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.98] text-white font-medium text-[16px] rounded-full shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('completeOrder')}</span>
          </button>
        )}

        {isCompleted && (
          <div className="w-full h-[54px] bg-gray-100 text-gray-400 font-medium text-[16px] rounded-full flex items-center justify-center gap-2 border border-gray-200">
            <span>{t('completed')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
