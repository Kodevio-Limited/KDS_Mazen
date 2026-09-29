export type OrderType = 'DELIVERY' | 'DINE IN' | 'TAKEAWAY';

export type OrderStatus = 'PREPARING' | 'READY' | 'COMPLETED';

export interface OrderItem {
  id: string;
  name: string;
  name_ar?: string;
  image: string;
  quantity: number;
  modifiers?: string[];
  modifiers_ar?: string[];
  notes?: string;
  notes_ar?: string;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: OrderType;
  tableNumber?: string;
  tableNumber_ar?: string;
  status: OrderStatus;
  elapsedMinutes: number;
  elapsedSeconds: number;
  isDelayed?: boolean;
  items: OrderItem[];
  createdAt: string;
}

export interface QuickSettings {
  newOrderSound: boolean;
  showOrderNotes: boolean;
  showItemModifiers: boolean;
}
