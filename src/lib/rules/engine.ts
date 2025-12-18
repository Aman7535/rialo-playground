import { determineEventType, determineOutcome } from './rules';
import { EventData } from '../eventStore';

export function processEvent(currentPrice: number, previousPrice: number): EventData {
  const type = determineEventType(previousPrice, currentPrice);
  const outcome = determineOutcome(type, currentPrice, previousPrice);
  
  return {
    id: crypto.randomUUID(),
    type,
    price: currentPrice,
    outcome,
    timestamp: new Date().toISOString()
  };
}