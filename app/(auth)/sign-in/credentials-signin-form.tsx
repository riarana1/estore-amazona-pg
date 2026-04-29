"use client"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithCredentials } from "@/lib/actions/user.actions"
import { signInDefaultValues } from "@/lib/constants"
import Link from "next/link"

export default function CredentialsSignInForm() {
  const [data, action, isPending] = useActionState(signInWithCredentials, {
    message: "",
    success: false,
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <Button disabled={isPending} className="w-full" variant="default">
            {isPending ? "Submitting..." : "Sign In"}
          </Button>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        {data &&
          !data.success &&
          !data.message && ( // Display generic error if action failed but no specific message
            <div className="text-center text-destructive">
              An unknown error occurred during sign-in. Please try again.
            </div>
          )}

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            target="_self"
            className="link"
            href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}
