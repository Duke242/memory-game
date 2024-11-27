import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/next-auth"
import config from "@/config"

export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(config.auth.loginUrl)
  }

  return <>{children}</>
}
