import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use the admin library which has hardcoded Firebase credentials
    try {
      const { isAdmin } = await import('@/lib/admin');
      const adminStatus = await isAdmin(email);
      return NextResponse.json({ isAdmin: adminStatus });
    } catch (firebaseError) {
      console.error('Firebase Admin error:', firebaseError);
      // Fallback to hardcoded admin check if Firebase fails
      const hardcodedAdmins = ['blacksheepwall.xyz@gmail.com', 'blacksheepwall.xyz@google.com'];
      return NextResponse.json({ isAdmin: hardcodedAdmins.includes(email) });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
} 