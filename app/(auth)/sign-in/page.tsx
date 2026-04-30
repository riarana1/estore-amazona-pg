import { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"

import CredentialsSignInForm from "./credentials-signin-form"

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
}

export default async function SignIn(props: {
  searchParams: Promise<{ callbackUrl: string }>
}) {
  const { callbackUrl } = await props.searchParams
  const session = await auth()
  if (session) {
    return redirect(callbackUrl || "/")
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/assets/icons/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              loading="eager"
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Select a method to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense>
            <CredentialsSignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
