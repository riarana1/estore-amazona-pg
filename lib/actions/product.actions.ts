"use server"

import { desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { Products } from "@/db/schema"

export async function getLatestProducts() {
  const data = await db.query.Products.findMany({
    orderBy: [desc(Products.createdAt)],
    limit: 4,
  })
  return data
}

export async function getProductBySlug(slug: string) {
  return await db.query.Products.findFirst({
    where: eq(Products.slug, slug),
  })
}
