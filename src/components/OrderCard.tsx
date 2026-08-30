'use client';

import React from 'react';
import Image from 'next/image';
import { Utensils, Clock, Check, ChefHat } from 'lucide-react';
import { KitchenOrder, QuickSettings } from '../types/kds';

interface OrderCardProps {
  order: KitchenOrder;
  settings: QuickSettings;
  onUpdateStatus: (orderId: string, newStatus: 'PREPARING' | 'READY' | 'COMPLETED') => void;
}

export default function OrderCard({ order, settings, onUpdateStatus }: OrderCardProps) {
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
    switch (order.type) {
      case 'DELIVERY':
        return 'bg-[#F2F2F2] border-[#B9B9B9] text-[#000000]';
      case 'DINE IN':
        return 'bg-[#EBF5FF] border-[#93C5FD] text-[#1E40AF]';
      case 'TAKEAWAY':
        return 'bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]';
      default:
        return 'bg-[#F2F2F2] border-[#B9B9B9] text-[#000000]';
    }
  };

  return (
    <div className="w-full max-w-[445px] bg-white rounded-[21px] p-6 shadow-sm border border-gray-100/80 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      {/* Top Section: Order Header */}
      <div>
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-bold text-[#000000] tracking-tight">
              {order.orderNumber}
            </span>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getTypeBadgeStyles()}`}>
              {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
            </div>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-2xl border font-bold text-[14px] flex items-center gap-1.5 shadow-xs ${getTimerStyles()}`}
          >
            <Clock size={15} />
            <span>{formatTimer(order.elapsedMinutes, order.elapsedSeconds)}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={item.id}>
              <div className="flex items-start justify-between gap-4">
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  {/* Food Image Box */}
                  <div className="relative w-[89px] h-[98px] rounded-[8px] bg-[#F2F2F2] overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={68}
                      height={68}
                      className="object-contain transform hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <h4 className="text-[19px] font-semibold text-[#2D2F33] leading-snug">
                      {item.name}
                    </h4>

                    {/* Modifiers */}
                    {settings.showItemModifiers && item.modifiers && item.modifiers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {item.modifiers.map((mod, i) => (
                          <span
                            key={i}
                            className="text-[13px] text-[#686868] font-medium inline-flex items-center gap-0.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/60"
                          >
                            <span className="text-[#2DC35F] font-bold text-sm">+</span>
                            {mod}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions Note */}
                    {settings.showOrderNotes && item.notes && (
                      <div className="flex items-center gap-1.5 text-[#026F4F] italic text-[13px] font-medium mt-1">
                        <Utensils size={14} className="flex-shrink-0" />
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quantity */}
                <div className="text-right flex-shrink-0 pt-0.5">
                  <span className="text-[18px] font-bold text-[#026F4F]">
                    Qty :{item.quantity}
                  </span>
                </div>
              </div>

              {/* Dashed divider between items */}
              {idx < order.items.length - 1 && (
                <div className="w-full border-b border-dashed border-[#B9B9B9] my-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Status Action Button */}
      <div className="mt-6 pt-2">
        {isPreparing && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-[54px] bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-medium text-[16px] rounded-full shadow-[0px_4px_16px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <ChefHat size={20} />
            <span>Mark Ready</span>
          </button>
        )}

        {isReady && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full h-[54px] bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.98] text-white font-medium text-[16px] rounded-full shadow-[0px_4px_16px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            <span>Complete Order</span>
          </button>
        )}

        {isCompleted && (
          <div className="w-full h-[54px] bg-gray-100 text-gray-400 font-medium text-[16px] rounded-full flex items-center justify-center gap-2 border border-gray-200">
            <Check size={20} className="text-gray-400" />
            <span>Completed</span>
          </div>
        )}
      </div>
    </div>
  );
}
