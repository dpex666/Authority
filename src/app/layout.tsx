import "./globals.css";
import SiteNav from "@/components/SiteNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-[color:var(--text)]">
        <SiteNav />
        <main className="pb-16">{children}</main>
      </body>
    </html>
  );
}
