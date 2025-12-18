import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Rialo Playground",
  description: "Event-Driven Logic Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-green-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}