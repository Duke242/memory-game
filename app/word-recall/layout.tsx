import { ReactNode } from "react"
import { getSEOTags } from "@/libs/seo"

export const metadata = getSEOTags({
  title: "Word Recall | MemoryMaster",
  description:
    "Study a list of words, then type back as many as you can remember. A classic test of verbal memory.",
  canonicalUrlRelative: "/word-recall",
})

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
