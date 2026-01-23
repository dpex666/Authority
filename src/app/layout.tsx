import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen text-[color:var(--text)]">
        {children}
      </body>
    </html>
  );
}
