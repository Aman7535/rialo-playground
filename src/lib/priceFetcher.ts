import { EventStore } from './eventStore';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

export async function fetchBTCPrice(): Promise<number> {
  try {
    const res = await fetch(COINGECKO_API, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 } // No cache
    });

    if (!res.ok) throw new Error('API Failed');

    const data = await res.json();
    const price = data?.bitcoin?.usd;

    if (!price || isNaN(price)) throw new Error('Invalid Data');

    return price;
  } catch (error) {
    // FAIL SAFE: Simulate price movement if API fails or rate limits
    const lastPrice = EventStore.getLastPrice() || 95000; // Default fallback
    const volatility = (Math.random() * 200) - 100; // +/- $100 movement
    return Math.floor(lastPrice + volatility);
  }
}