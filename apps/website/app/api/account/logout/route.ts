import { NextResponse } from 'next/server';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function POST() {
  try {
    const response = new NextResponse(null, { status: 204 });

    // Clear auth cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
