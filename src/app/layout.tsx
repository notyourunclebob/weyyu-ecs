import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayland Ytani ECS",
  description: "Employee electronic claims system",
};

export default function RootLayout({ children }:Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
