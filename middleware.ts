// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // 1. 处理CORS
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', 
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://your-production-domain.com');
  
  response.headers.set('Access-Control-Allow-Methods', 
    'GET, POST, PUT, DELETE, OPTIONS');
  
  response.headers.set('Access-Control-Allow-Headers',
    'Content-Type, Authorization');

  // 2. 验证管理员权限
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await getToken({ req: request });
    
    if (!session?.roles?.includes("ADMIN")) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}