import React from "react"
import { Eye, Layers, Timer, Target } from "lucide-react"

const benefits = [
  {
    title: "Visual memory",
    icon: Eye,
    description: "Hold patterns and positions in mind with Box Memory and Card Match.",
  },
  {
    title: "Working memory",
    icon: Layers,
    description: "Keep growing sequences, numbers and word lists in order.",
  },
  {
    title: "Quick thinking",
    icon: Timer,
    description: "Timed rounds push you to recall and decide under pressure.",
  },
  {
    title: "Focus",
    icon: Target,
    description: "Short, distraction-free rounds that reward full attention.",
  },
]

const BenefitsSection = () => (
  <section id="benefits" className="scroll-mt-20 py-16 sm:py-20">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight">Why it works</h2>
        <p className="mt-3 text-muted">
          Memory improves with practice. Each game trains a different skill, and
          adjustable difficulty keeps you at the edge of what you can do.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
              <benefit.icon size={20} aria-hidden />
            </span>
            <h3 className="font-semibold">{benefit.title}</h3>
            <p className="mt-2 text-sm text-muted">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default BenefitsSection
