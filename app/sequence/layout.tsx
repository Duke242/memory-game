import { ReactNode } from "react"
import { getSEOTags } from "@/libs/seo"

export const metadata = getSEOTags({
  title: "Sequence Memory | MemoryMaster",
  description:
    "Watch the tiles light up and repeat the sequence. It grows by one every round.",
  canonicalUrlRelative: "/sequence",
})

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
