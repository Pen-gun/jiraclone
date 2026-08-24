import { NextResponse } from 'next/server';

// Simple liveness check - just checks if the process is running
export async function GET() {
  return NextResponse.json(
    {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 }
  );
}
