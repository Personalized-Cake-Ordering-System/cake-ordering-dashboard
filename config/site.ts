export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cuscake Order",
  description: "Cake Dashboard",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://movemate-dashboard.vercel.app",
  links: { github: "https://github.com/vinhnt2002/movemate-dashboard" },
};
