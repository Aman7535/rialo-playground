export type EventType = 'PRICE_INIT' | 'PRICE_UP' | 'PRICE_DOWN' | 'PRICE_STABLE';

export const determineEventType = (prev: number, curr: number): EventType => {
  if (prev === 0) return 'PRICE_INIT';
  if (curr > prev) return 'PRICE_UP';
  if (curr < prev) return 'PRICE_DOWN';
  return 'PRICE_STABLE';
};

export const determineOutcome = (type: EventType, price: number, prevPrice: number): string => {
  const diff = Math.abs(price - prevPrice);
  
  if (type === 'PRICE_INIT') return 'SYSTEM_READY';
  if (type === 'PRICE_STABLE') return 'HOLD_POSITION';
  
  if (diff > 500) return 'VOLATILITY_SPIKE';
  if (type === 'PRICE_UP') return 'MOMENTUM_UP';
  if (type === 'PRICE_DOWN') return 'MOMENTUM_DOWN';
  
  return 'NEUTRAL';
};