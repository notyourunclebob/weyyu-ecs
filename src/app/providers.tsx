"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // using this in layout.tsx will make session data available everywhere
  return <SessionProvider>{children}</SessionProvider>;
}
