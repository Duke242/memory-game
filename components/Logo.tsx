import Link from "next/link"
import { Brain } from "lucide-react"

const Logo = () => (
  <Link
    href="/"
    className="focus-ring inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight"
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
      <Brain size={18} aria-hidden />
    </span>
    MemoryMaster
  </Link>
)

export default Logo
