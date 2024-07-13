import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;

  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    return Response.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
