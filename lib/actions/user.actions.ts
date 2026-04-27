"use server"

import { hashSync } from "bcrypt-ts-edge"
import { signIn, signOut } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { signInFormSchema, signUpFormSchema } from "../validator"
import { formatError } from "../utils"

export async function signUp(_prevState: unknown, formData: FormData) {
  try {
    const data = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashSync(data.password, 10),
    })

    // Automatically sign in after successful registration
    await signIn("credentials", {
      email: data.email,
      password: data.password,
    })

    return { success: true, message: "User created successfully" }
  } catch (error) {
    // Let redirects from signIn bubble up to Next.js
    if ((error as { digest?: string }).digest?.includes("NEXT_REDIRECT")) {
      throw error
    }

    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? "Email already exists"
        : formatError(error),
    }
  }
}

export async function signInWithCredentials(
  _prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })
    await signIn("credentials", user)
    return { success: true, message: "Sign in successfully" }
  } catch (error) {
    if ((error as { digest?: string }).digest?.includes("NEXT_REDIRECT")) {
      throw error
    }

    return { success: false, message: "Invalid email or password" }
  }
}

export const SignOut = async () => {
  await signOut()
}
