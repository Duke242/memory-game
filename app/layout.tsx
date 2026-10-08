import { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Viewport } from "next"
import PlausibleProvider from "next-plausible"
import { getSEOTags } from "@/libs/seo"
import ClientLayout from "@/components/LayoutClient"
import config from "@/config"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const font = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  // Matches the page background (see --mm-canvas in globals.css)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b13" },
  ],
  width: "device-width",
  initialScale: 1,
}

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <body>
        <Analytics />
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
