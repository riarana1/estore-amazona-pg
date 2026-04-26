"use client"

import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="Product main image"
        width={1000}
        height={1000}
        className="min-h-75 object-cover object-center"
        priority={true}
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              "mr-2 cursor-pointer border hover:border-orange-600",
              current === index && "border-orange-500"
            )}
            onClick={() => setCurrent(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
