"use server"

import { hashSync } from "bcrypt-ts-edge"
import { AuthError } from "next-auth"

import { signIn, signOut } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { signInFormSchema, signUpFormSchema } from "../validator"

export async function signUp(prevState: unknown, formData: FormData) {
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
    if (error instanceof AuthError) {
      return { success: false, message: "Failed to create account" }
    }
    throw error
  }
}

export async function signInWithCredentials(
  prevState: unknown,
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
    if (error instanceof AuthError) {
      return { success: false, message: "Invalid email or password" }
    }
    throw error
  }
}

export const SignOut = async () => {
  await signOut()
}
