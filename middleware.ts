import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Permitir acceso público a GET /api/products y GET /api/products/[id] (para el sitio Astro)
  // Nota: Para métodos POST/PUT/DELETE, la validación se hace en las rutas API
  if (pathname.startsWith('/api/products') && request.method === 'GET') {
    return NextResponse.next();
  }

  // Si está en login y ya está autenticado, redirigir al dashboard
  if (pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Proteger rutas del admin
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/products') ||
    (pathname.startsWith('/api') &&
      !pathname.startsWith('/api/products') &&
      !pathname.startsWith('/api/auth'))
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/api/products/:path*',
    '/api/upload/:path*',
    '/api/auth/:path*',
    '/login',
  ],
};
