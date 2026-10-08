import { ReactNode } from "react"
import { getSEOTags } from "@/libs/seo"

export const metadata = getSEOTags({
  title: "Card Match | MemoryMaster",
  description:
    "The classic concentration game. Flip cards two at a time and find every pair in as few moves as you can.",
  canonicalUrlRelative: "/card-match",
})

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
