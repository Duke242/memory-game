import Logo from "@/components/Logo"
import { ButtonLink } from "@/components/game/ui"

export default function Custom404() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <p className="text-7xl font-bold tracking-tight text-brand-ink">404</p>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">This page slipped our mind</h1>
        <p className="text-muted">It doesn&apos;t exist, or it has moved.</p>
      </div>
      <ButtonLink href="/">Back to the games</ButtonLink>
    </section>
  )
}
