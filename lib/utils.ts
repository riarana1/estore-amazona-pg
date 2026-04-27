import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatError = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "name" in error) {
    const err = error as {
      name: string
      errors?: Record<string, { message: string; path?: string }>
    }
    if (err.name === "ZodError" && err.errors) {
      const fieldErrors = Object.keys(err.errors).map((field) => {
        const errorDetail = err.errors![field]
        return `${errorDetail?.path}: ${errorDetail?.message}`
      })
      return fieldErrors.join(". ")
    } else if (err.name === "ValidationError" && err.errors) {
      const fieldErrors = Object.keys(err.errors).map((field) => {
        const errorMessage = err.errors![field]?.message
        return errorMessage
      })
      return fieldErrors.join(". ")
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const err = error as { message: unknown }
    return typeof err.message === "string"
      ? err.message
      : JSON.stringify(err.message)
  }

  return typeof error === "string" ? error : JSON.stringify(error)
}
