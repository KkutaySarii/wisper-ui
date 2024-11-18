import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const publicKey = request.cookies.get("publicKey");

  if (!publicKey && request.nextUrl.pathname !== "/home") {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
