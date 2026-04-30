"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Product } from "@/types"
import Image from "next/image"
import Link from "next/link"

export function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <Carousel
      className="mb-12 w-full"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  alt={product.name}
                  src={product.banner!}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="h-auto w-full"
                  loading="eager"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-opacity-50 bg-gray-900 px-2 text-2xl font-bold text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
