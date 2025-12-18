export interface EventData {
  type: 'PRICE_INIT' | 'PRICE_UP' | 'PRICE_DOWN' | 'PRICE_STABLE';
  price: number;
  outcome: string;
  timestamp: string;
  id: string;
  isSimulated?: boolean; // New field to highlight manual events
}

// Global interface to prevent garbage collection
declare global {
  var _eventStore: {
    events: EventData[];
    lastPrice: number;
  };
}

// Initialize
if (!globalThis._eventStore) {
  globalThis._eventStore = {
    events: [],
    lastPrice: 0,
  };
}

const MAX_EVENTS = 10;

export const EventStore = {
  getEvents: () => globalThis._eventStore.events,
  
  getLastPrice: () => globalThis._eventStore.lastPrice,
  
  // New: Allow manual price override
  setForcePrice: (price: number) => {
    globalThis._eventStore.lastPrice = price;
  },

  addEvent: (event: EventData) => {
    globalThis._eventStore.events.unshift(event);
    globalThis._eventStore.lastPrice = event.price;
    
    if (globalThis._eventStore.events.length > MAX_EVENTS) {
      globalThis._eventStore.events = globalThis._eventStore.events.slice(0, MAX_EVENTS);
    }
  }
};