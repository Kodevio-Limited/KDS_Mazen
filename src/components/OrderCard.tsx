'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ReceiptText, Clock, Check, X } from 'lucide-react';
import { KitchenOrder, QuickSettings } from '../types/kds';

interface OrderCardProps {
  order: KitchenOrder;
  settings: QuickSettings;
  onUpdateStatus: (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => void;
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
}

export default function OrderCard({ order, settings, onUpdateStatus, onAcceptOrder, onRejectOrder }: OrderCardProps) {
  const t = useTranslations('orderCard');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const isPending = order.status === 'PENDING';
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
    <div className={`w-full bg-white rounded-xl p-3 shadow-sm border flex flex-col justify-between transition-all duration-300 hover:shadow-md ${isPending ? 'border-dashed border-2 border-[#F59E0B]' : 'border-gray-100/80'}`}>
      {/* Top Section: Order Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-dashed border-gray-200">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="text-lg font-bold text-[#000000] tracking-tight">
              <bdi>{order.orderNumber}</bdi>
            </span>
            {isPending && (
              <span className="rounded-full bg-[#F59E0B] px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-white">
                {t('newTicket')}
              </span>
            )}
            <div className={`truncate px-1.5 py-px rounded-full border text-[10px] font-bold uppercase tracking-wider ${getTypeBadgeStyles()}`}>
              {t(`types.${order.type}`)}
              {renderTableLabel()}
            </div>
          </div>

          <div
            className={`shrink-0 px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 shadow-xs ${getTimerStyles()}`}
          >
            <Clock size={12} className="shrink-0" />
            <span>
              <bdi>{formatTimer(order.elapsedMinutes, order.elapsedSeconds)}</bdi>
            </span>
          </div>
        </div>

        {/* Items List (no photos — compact mode fits more tickets on screen) */}
        <div className="space-y-1.5">
          {order.items.map((item, idx) => {
            const displayName = isAr && item.name_ar ? item.name_ar : item.name;
            const displayModifiers = isAr && item.modifiers_ar ? item.modifiers_ar : item.modifiers;
            const displayNotes = isAr && item.notes_ar ? item.notes_ar : item.notes;

            return (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  {/* Details */}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h4 className="text-sm font-medium leading-snug text-[#2D2F33]">
                      {displayName}
                    </h4>

                    {/* Modifiers */}
                    {settings.showItemModifiers && displayModifiers && displayModifiers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0">
                        {displayModifiers.map((mod, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#989898]"
                          >
                            <span className="text-xs font-normal text-[#2DC35F]">+</span>
                            {mod}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions Note */}
                    {settings.showOrderNotes && displayNotes && (
                      <div className="flex items-center gap-1 text-[11px] font-medium italic text-[#026F4F]">
                        <ReceiptText size={12} className="shrink-0" />
                        <span>{displayNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Quantity */}
                  <div className="shrink-0 text-end">
                    <span className="text-[13px] font-semibold text-[#026F4F]">
                      {t('qty', { qty: item.quantity })}
                    </span>
                  </div>
                </div>

                {/* Dashed divider between items */}
                {idx < order.items.length - 1 && (
                  <div className="w-full border-b border-dashed border-[#B9B9B9] my-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Status Action Button */}
      <div className="mt-auto pt-3">
        {isPending && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAcceptOrder(order.id)}
              aria-label={t('accept')}
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full bg-[#16A34A] text-[13px] font-semibold text-white shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all hover:bg-[#15803d] active:scale-[0.98]"
            >
              <Check size={15} strokeWidth={2.5} />
              <span>{t('accept')}</span>
            </button>
            <button
              onClick={() => onRejectOrder(order.id)}
              aria-label={t('reject')}
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full border-2 border-[#E52B2B] text-[13px] font-semibold text-[#E52B2B] transition-all hover:bg-[#E52B2B] hover:text-white active:scale-[0.98]"
            >
              <X size={15} strokeWidth={2.5} />
              <span>{t('reject')}</span>
            </button>
          </div>
        )}

        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-10 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-medium text-[13px] rounded-full shadow-[0px_4px_16px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('markReady')}</span>
          </button>
        )}

        {isReady && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full h-10 bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.98] text-white font-medium text-[13px] rounded-full shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('completeOrder')}</span>
          </button>
        )}

        {isCompleted && (
          <div className="w-full h-10 bg-gray-100 text-gray-400 font-medium text-[13px] rounded-full flex items-center justify-center gap-2 border border-gray-200">
            <span>{t('completed')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
