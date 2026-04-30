import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Product } from "@/types"
import ProductPrice from "./product-price"

import { Button } from "@/components/ui/button"

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            alt={product.name}
            className="aspect-square rounded object-cover"
            height={300}
            src={product.images![0]}
            width={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div>
          <p className="text-xs">{product.brand}</p>
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-sm font-medium">{product.name}</h2>
          </Link>
        </div>
        <div className="flex-between gap-4">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
        <div>
          <Link href={`/product/${product.slug}`} className="w-full">
            <Button variant="outline" size="sm" className="flex w-full gap-2">
              <span>Quick View</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
