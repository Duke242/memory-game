import { ReactNode } from "react"
import { getSEOTags } from "@/libs/seo"

export const metadata = getSEOTags({
  title: "Your progress | MemoryMaster",
  description: "See how your results change over time compared with your usual range.",
  canonicalUrlRelative: "/progress",
})

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
