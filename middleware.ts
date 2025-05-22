import { NextResponse } from "next/server";
import { auth } from "./lib/next-auth/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user.role?.toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const isBakery = userRole === "BAKERY";

  const isAdminDashboard = nextUrl.pathname.startsWith("/dashboard/admin");
  const isDashboard = nextUrl.pathname === "/dashboard";

  if (isAdminDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    if (!isAdmin) {
      // Bakery hoặc role khác cố vào admin sẽ bị chuyển về /dashboard
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (isDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    if (isAdmin) {
      // Admin cố vào /dashboard sẽ bị chuyển sang /dashboard/admin
      return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
    }
    if (!isBakery) {
      // Role khác không được vào dashboard
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
