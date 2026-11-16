import { KitchenOrder } from '../types/kds';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return (window as any).__EMSA7_API_URL__ || process.env.NEXT_PUBLIC_API_URL || 'https://validity-include-essence-intention.trycloudflare.com';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://validity-include-essence-intention.trycloudflare.com';
};

export const kdsApi = {
  fetchQueue: async (branchId: string = 'branch-1'): Promise<KitchenOrder[] | null> => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/kds/queue/?branch_id=${branchId}`);
      if (!res.ok) return null;
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) return null;

      return json.data.map((ticket: any) => ({
        id: ticket.ticket_id || ticket.order_id,
        orderNumber: ticket.order_number,
        type: ticket.order_type === 'DINE_IN' ? 'DINE IN' : ticket.order_type === 'DELIVERY' ? 'DELIVERY' : 'TAKEAWAY',
        tableNumber: ticket.table_number ? `Table ${ticket.table_number}` : undefined,
        tableNumber_ar: ticket.table_number ? `طاولة ${ticket.table_number}` : undefined,
        status: ticket.status === 'PENDING' ? 'PENDING' : ticket.status === 'READY' ? 'READY' : 'PREPARING',
        elapsedMinutes: ticket.elapsed_minutes || 0,
        elapsedSeconds: 0,
        isDelayed: (ticket.elapsed_minutes || 0) >= 15,
        items: (ticket.items || []).map((it: any) => ({
          name: it.name,
          name_ar: it.name_ar,
          quantity: it.quantity,
          modifiers: it.modifiers || [],
          notes: it.notes,
        })),
        notes: ticket.special_instructions,
        notes_ar: ticket.special_instructions,
      }));
    } catch {
      return null;
    }
  },

  bumpTicket: async (ticketId: string, action: string = 'next_stage') => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/kds/tickets/${ticketId}/bump/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to bump ticket on backend:', e);
      return { success: false };
    }
  },

  connectWebSocket: (branchId: string, onMessage: (data: any) => void): WebSocket | null => {
    try {
      const baseUrl = getApiBaseUrl();
      const wsProto = baseUrl.startsWith('https') ? 'wss:' : 'ws:';
      const host = baseUrl.replace(/^https?:\/\//, '');
      const wsUrl = `${wsProto}//${host}/ws/kds/${branchId}/`;
      const ws = new WebSocket(wsUrl);
      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          onMessage(payload);
        } catch {}
      };
      return ws;
    } catch {
      return null;
    }
  },
};
