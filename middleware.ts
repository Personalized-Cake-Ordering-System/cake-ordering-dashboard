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
      // Nếu chưa đăng nhập, redirect về trang chủ kèm thông báo
      return NextResponse.redirect(new URL("/?error=unauthorized", nextUrl));
    }
    if (!isAdmin) {
      // Bakery hoặc role khác cố vào admin sẽ bị chuyển về /dashboard hoặc về trang chủ nếu không phải bakery
      if (isBakery) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/?error=unauthorized", nextUrl));
    }
  }

  if (isDashboard) {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, redirect về trang chủ kèm thông báo
      return NextResponse.redirect(new URL("/?error=unauthorized", nextUrl));
    }
    if (isAdmin) {
      // Admin cố vào /dashboard sẽ bị chuyển sang /dashboard/admin
      return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
    }
    if (!isBakery) {
      // Role khác không được vào dashboard, redirect về trang chủ kèm thông báo
      return NextResponse.redirect(new URL("/?error=unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
