import type { Metadata } from "next";
import "./globals.css";
import { Michroma } from 'next/font/google'

export const metadata: Metadata = {
  title: "Weyland Ytani ECS",
  description: "Employee electronic claims system",
};

const michroma = Michroma({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className="bg-yutaniGrey">
      <body className={michroma.className}>
        {children}
      </body>
    </html>
  );
}
