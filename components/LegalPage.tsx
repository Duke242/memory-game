import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/Logo"
import SiteFooter from "@/components/SiteFooter"

export const LegalSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    <div className="space-y-3 text-muted [&_a]:font-medium [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      {children}
    </div>
  </section>
)

const LegalPage = ({
  title,
  updated,
  intro,
  children,
}: {
  title: string
  updated: string
  intro: React.ReactNode
  children: React.ReactNode
}) => (
  <div className="flex min-h-screen flex-col">
    <header className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to games
        </Link>
      </div>
    </header>

    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:py-16">
      <p className="text-sm font-medium text-muted">Last updated {updated}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 leading-relaxed text-ink sm:p-6">
        {intro}
      </div>
      <div className="mt-10 space-y-10 leading-relaxed">{children}</div>
    </main>

    <SiteFooter />
  </div>
)

export default LegalPage
