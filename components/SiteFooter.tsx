import Link from "next/link"
import Logo from "@/components/Logo"

const SiteFooter = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <Logo />
      <div className="flex gap-5">
        <Link href="/privacy-policy" className="focus-ring rounded hover:text-ink">
          Privacy
        </Link>
        <Link href="/tos" className="focus-ring rounded hover:text-ink">
          Terms
        </Link>
      </div>
    </div>
  </footer>
)

export default SiteFooter
