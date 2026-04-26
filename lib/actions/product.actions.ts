"use server"

import { desc } from "drizzle-orm"

import { db } from "@/db"
import { Products } from "@/db/schema"

export async function getLatestProducts() {
  const data = await db.query.Products.findMany({
    orderBy: [desc(Products.createdAt)],
    limit: 4,
  })
  return data
}
