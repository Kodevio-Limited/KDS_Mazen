export type OrderType = 'DELIVERY' | 'DINE IN' | 'TAKEAWAY';

export type OrderStatus = 'PREPARING' | 'READY' | 'COMPLETED';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  modifiers?: string[];
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: OrderType;
  tableNumber?: string;
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
