import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { compareSync } from "bcrypt-ts-edge"
import { eq } from "drizzle-orm"
import type { NextAuthConfig, Session, User } from "next-auth"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "./db/index"
import { carts, users } from "./db/schema"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT
      user?: User
      trigger?: string
      session?: Session // Session is optional here during jwt callback
    }) => {
      if (user) {
        if (user.name === "NO_NAME" && user.id) {
          token.name = user.email!.split("@")[0]
          await db
            .update(users)
            .set({
              name: token.name,
            })
            .where(eq(users.id, user.id))
        }

        token.role = user.role
        if (trigger === "signIn" || trigger === "signUp") {
          const cookieStore = await cookies()
          const sessionCartId = cookieStore.get("sessionCartId")?.value

          if (sessionCartId) {
            const sessionCartExists = await db.query.carts.findFirst({
              where: eq(carts.sessionCartId, sessionCartId),
            })

            if (sessionCartExists && !sessionCartExists.userId && user.id) {
              const userCartExists = await db.query.carts.findFirst({
                where: eq(carts.userId, user.id),
              })
              if (userCartExists) {
                cookieStore.set("beforeSigninSessionCartId", sessionCartId)
                cookieStore.set("sessionCartId", userCartExists.sessionCartId)
              } else {
                await db
                  .update(carts)
                  .set({ userId: user.id })
                  .where(eq(carts.id, sessionCartExists.id))
              }
            }
          }
        }
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name
      }

      return token
    },
    session: async ({
      session,
      token,
      user,
      trigger,
    }: {
      token: JWT
      user?: User
      trigger?: string
      session: Session
    }) => {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        if (trigger === "update" && user?.name) {
          session.user.name = user.name
        }
      }
      return session
    },
    authorized({
      request,
      auth,
    }: {
      request: NextRequest
      auth: Session | null
    }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID()
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        })
        response.cookies.set("sessionCartId", sessionCartId)
        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig
export const { handlers, auth, signIn, signOut } = NextAuth(config)
