import { NextResponse } from 'next/server';
import { fetchBTCPrice } from '@/lib/priceFetcher';
import { processEvent } from '@/lib/rules';
import { EventStore } from '@/lib/eventStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prevPrice = EventStore.getLastPrice();
    const currentPrice = await fetchBTCPrice();
    const newEvent = processEvent(currentPrice, prevPrice);
    
    EventStore.addEvent(newEvent);

    return NextResponse.json({
      events: EventStore.getEvents(),
      meta: { serverTime: new Date().toISOString() }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Engine Error' }, { status: 500 });
  }
}

// NEW: Handle Manual Interactions
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    
    // Get current state
    const currentPrice = EventStore.getLastPrice() || 95000;
    let newPrice = currentPrice;

    // Simulate huge market moves based on user click
    if (action === 'CRASH') newPrice = Math.floor(currentPrice * 0.95); // -5% Drop
    if (action === 'PUMP') newPrice = Math.floor(currentPrice * 1.05);  // +5% Pump
    
    // Force the event immediately
    const forcedEvent = processEvent(newPrice, currentPrice);
    forcedEvent.isSimulated = true; // Mark it so we can style it differently
    
    EventStore.addEvent(forcedEvent);

    return NextResponse.json({ success: true, event: forcedEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Simulation Failed' }, { status: 500 });
  }
}