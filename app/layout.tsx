import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mega Rifa Premiada 2025 - Concorra a R$ 50.000 em Prêmios",
  description:
    "Participe da maior rifa do ano! Mais de R$ 50.000 em prêmios, descontos progressivos e pagamento seguro via PIX. Quanto mais números, maior o desconto!",
  keywords: "rifa, sorteio, prêmios, PIX, desconto, 2025",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
