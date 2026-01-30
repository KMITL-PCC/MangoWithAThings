import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("auth")
  const { pathname } = req.nextUrl

  // ✅ อนุญาตหน้า login
  if (pathname === "/login") {
    return NextResponse.next()
  }

  // ✅ อนุญาต static / api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // ❌ ยังไม่ login → เตะไป login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
