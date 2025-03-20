// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
  // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  //   <SessionProvider>{children}</SessionProvider>
  // </ThemeProvider>
  <SessionProvider>{children}</SessionProvider>  
)
  
}