import React from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

type Variant = "primary" | "secondary" | "ghost"
type Size = "md" | "lg"

const buttonClasses = (variant: Variant, size: Size, fullWidth?: boolean) =>
  cx(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 select-none",
    size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm",
    variant === "primary" && "bg-brand text-white shadow-sm hover:bg-brand/90 active:bg-brand/80",
    variant === "secondary" && "border border-line bg-surface text-ink hover:bg-surface-2",
    variant === "ghost" && "text-muted hover:bg-surface-2 hover:text-ink",
    fullWidth && "w-full"
  )

export const Button = ({
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}) => (
  <button
    type="button"
    className={cx(buttonClasses(variant, size, fullWidth), className)}
    {...props}
  />
)

export const ButtonLink = ({
  href,
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
  children,
}: {
  href: string
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
}) => (
  <Link href={href} className={cx(buttonClasses(variant, size, fullWidth), className)}>
    {children}
  </Link>
)

export const Panel = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cx(
      "rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-8",
      className
    )}
  >
    {children}
  </div>
)

export const Field = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) => (
  <div className="space-y-2.5">
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="text-sm tabular-nums text-muted">{hint}</span>}
    </div>
    {children}
  </div>
)

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns,
}: {
  label: string
  options: { value: T; label: React.ReactNode }[]
  value: T
  onChange: (value: T) => void
  columns?: number
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-xl bg-surface-2 p-1"
      style={{
        gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              "focus-ring h-9 rounded-lg text-sm font-medium tabular-nums transition-colors",
              selected
                ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                : "text-muted hover:text-ink"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}) => (
  <input
    type="range"
    aria-label={label}
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="focus-ring h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[rgb(var(--mm-brand))]"
  />
)

export const ProgressBar = ({
  value,
  label,
}: {
  value: number
  label?: string
}) => (
  <div
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value)}
    className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
  >
    <div
      className="h-full rounded-full bg-brand transition-[width] duration-100 ease-linear"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
)

export const Stat = ({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: React.ReactNode
  tone?: "neutral" | "good" | "bad" | "brand"
}) => (
  <div className="rounded-xl bg-surface-2 px-4 py-3">
    <div className="text-xs font-medium uppercase tracking-wide text-muted">
      {label}
    </div>
    <div
      className={cx(
        "mt-1 text-xl font-semibold tabular-nums",
        tone === "good" && "text-good",
        tone === "bad" && "text-bad",
        tone === "brand" && "text-brand-ink"
      )}
    >
      {value}
    </div>
  </div>
)

export const NewBestBadge = () => (
  <span className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-ink">
    <Trophy size={14} aria-hidden />
    New personal best
  </span>
)

export const ResultHeader = ({
  eyebrow,
  title,
  description,
  newBest,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  newBest?: boolean
}) => (
  <div className="space-y-3 text-center">
    {eyebrow && (
      <p className="text-sm font-medium uppercase tracking-wide text-muted">
        {eyebrow}
      </p>
    )}
    <h2 className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
      {title}
    </h2>
    {description && <p className="text-muted">{description}</p>}
    {newBest && (
      <div>
        <NewBestBadge />
      </div>
    )}
  </div>
)

export { cx }
