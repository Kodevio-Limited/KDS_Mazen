'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X } from 'lucide-react';
import { KitchenOrder, QuickSettings } from '../types/kds';

interface OrderCardProps {
  order: KitchenOrder;
  settings: QuickSettings;
  onUpdateStatus: (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => void;
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
}

export default function OrderCard({
  order,
  settings,
  onUpdateStatus,
  onAcceptOrder,
  onRejectOrder,
}: OrderCardProps) {
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
      return 'bg-[#FFD1D1] border-[#F75959] text-[#E52A2A]';
    }
    if (order.elapsedMinutes >= 8) {
      return 'bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]';
    }
    return 'bg-[#DCFCE7] border-[#22C55E] text-[#15803D]';
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
    <div
      className={`w-full max-w-[445px] h-[470px] bg-white rounded-[20.8px] pt-[22px] px-[24.64px] pb-[35px] flex flex-col justify-between transition-all duration-300 ${
        isPending ? 'border-2 border-dashed border-[#F59E0B]' : ''
      }`}
    >
      {/* Top Header Matching Figma Frame 2147226757 */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-[24px]">
          <div className="flex items-center gap-[14px]">
            <span className="text-[29.11px] font-medium text-black tracking-tight leading-none">
              <bdi>{order.orderNumber}</bdi>
            </span>
            {isPending && (
              <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                {t('newTicket')}
              </span>
            )}
            <div className="w-[84px] h-[34px] rounded-[23px] bg-[#F1F1F1] border border-[#B9B9B9] text-[13px] font-medium uppercase tracking-wider text-black flex items-center justify-center">
              {t(`types.${order.type}`)}
              {renderTableLabel()}
            </div>
          </div>

          {/* Timer Pill Matching Figma Frame 2147226756 */}
          <div
            className={`w-[69px] h-[40px] rounded-[16px] border font-medium text-[13px] flex items-center justify-center leading-none ${getTimerStyles()}`}
          >
            <span>
              <bdi>{formatTimer(order.elapsedMinutes, order.elapsedSeconds)}</bdi>
            </span>
          </div>
        </div>

        {/* Items List with Food Images Matching Figma Frame 2147226754 */}
        <div>
          {order.items.slice(0, 2).map((item, idx) => {
            const displayName = isAr && item.name_ar ? item.name_ar : item.name;
            const displayModifiers = isAr && item.modifiers_ar ? item.modifiers_ar : item.modifiers;
            const displayNotes = isAr && item.notes_ar ? item.notes_ar : item.notes;

            return (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  {/* Left: Food Box + Details */}
                  <div className="flex items-center gap-[21px] flex-1 min-w-0">
                    {/* Food Thumbnail Box Matching Figma Frame 2147225781 */}
                    <div className="w-[89.4px] h-[97.7px] bg-[#F1F1F1] rounded-[7.28px] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src="/images/food-41e5d7.png"
                        alt={displayName}
                        className="w-[67.58px] h-[67.58px] object-contain shrink-0"
                      />
                    </div>

                    {/* Details Info Matching Figma Frame 2147226750 */}
                    <div className="flex flex-col gap-[10px] min-w-0 flex-1">
                      <h4 className="text-[19.75px] font-medium text-[#2D2F33] leading-[27.66px] truncate">
                        {displayName}
                      </h4>

                      {/* Modifiers Matching Figma Frame 2147226713: Green plus + Gray modifier text */}
                      {settings.showItemModifiers && displayModifiers && displayModifiers.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-[7px] leading-tight">
                          {displayModifiers.map((mod, i) => (
                            <span key={i} className="inline-flex items-center gap-[3px]">
                              <span className="text-[#2DC35F] text-[18.36px] font-normal leading-none">+</span>
                              <span className="text-[#989898] text-[14.92px] font-normal leading-[20.88px]">{mod}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes with Note Icon Matching Figma Frame 2147226651 */}
                      {settings.showOrderNotes && displayNotes && (
                        <div className="flex items-center gap-[3px] leading-tight">
                          <img
                            src="/images/lets-icons_order.svg"
                            alt=""
                            className="w-[20.13px] h-[20.13px] shrink-0"
                          />
                          <span className="text-[#026F4F] italic text-[13.09px] font-normal leading-[18.32px] truncate">
                            {displayNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity Matching Figma */}
                  <div className="shrink-0 self-end mb-1">
                    <span className="text-[18.71px] font-semibold text-[#026F4F] leading-[26.2px] whitespace-nowrap">
                      {isAr ? `الكمية :${item.quantity}` : `Qty :${item.quantity}`}
                    </span>
                  </div>
                </div>

                {/* Dashed divider between items Matching Figma Vector 14 */}
                {idx < Math.min(order.items.length, 2) - 1 && (
                  <div className="w-full border-b border-dashed border-[#989898] my-[20px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Button Matching Figma Frame 2147226388 */}
      <div className="w-full">
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAcceptOrder(order.id)}
              aria-label={t('accept')}
              className="flex h-[54px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#16A34A] text-[16.14px] font-medium text-white shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all hover:bg-[#15803d] active:scale-[0.98] cursor-pointer"
            >
              <Check size={18} strokeWidth={2.5} />
              <span>{t('accept')}</span>
            </button>
            <button
              onClick={() => onRejectOrder(order.id)}
              aria-label={t('reject')}
              className="flex h-[54px] flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#E52B2B] text-[16.14px] font-medium text-[#E52B2B] transition-all hover:bg-[#E52B2B] hover:text-white active:scale-[0.98] cursor-pointer"
            >
              <X size={18} strokeWidth={2.5} />
              <span>{t('reject')}</span>
            </button>
          </div>
        )}

        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-[54px] bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.99] text-white font-medium text-[16.14px] rounded-full shadow-[0px_4px_16px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center cursor-pointer"
          >
            <span>{t('markReady')}</span>
          </button>
        )}

        {isReady && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full h-[54px] bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.99] text-white font-medium text-[16.14px] rounded-full shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center cursor-pointer"
          >
            <span>{t('completeOrder')}</span>
          </button>
        )}

        {isCompleted && (
          <div className="w-full h-[54px] bg-gray-100 text-gray-400 font-medium text-[16.14px] rounded-full flex items-center justify-center border border-gray-200">
            <span>{t('completed')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
