import { ReactNode } from "react"
import { getSEOTags } from "@/libs/seo"

export const metadata = getSEOTags({
  title: "Alertness Check | MemoryMaster",
  description:
    "A 3-minute reaction-time test based on the Psychomotor Vigilance Task. Compare each result with your own usual range.",
  canonicalUrlRelative: "/alertness",
})

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
