"use client"

import slugify from "slugify"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createProduct, updateProduct } from "@/lib/actions/product.actions"
import { productDefaultValues } from "@/lib/constants"
import {
  insertProductSchema,
  productFormSchema,
  updateProductSchema,
} from "@/lib/validator"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm, Resolver, useWatch } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { UploadButton } from "@/lib/utils/uploadthing"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update"
  product?: Product
  productId?: string
}) => {
  const router = useRouter()

  // Use productFormSchema to ensure the form state can hold an 'id' during updates
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: (type === "Update"
      ? zodResolver(updateProductSchema)
      : zodResolver(insertProductSchema)) as Resolver<
      z.infer<typeof productFormSchema>
    >,
    defaultValues: {
      ...productDefaultValues,
      ...(product ? product : {}), // Spread existing product data if available
      stock:
        product?.stock !== undefined
          ? Number(product.stock)
          : productDefaultValues.stock, // Ensure stock is a number
      ...(type === "Update" && (product?.id || productId)
        ? { id: product?.id || productId }
        : {}), // Explicitly add ID for update mode
    },
  })

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    if (type === "Create") {
      // For creation, 'id' should not be sent, so cast to insertProductSchema
      const res = await createProduct(
        values as z.infer<typeof insertProductSchema>
      )
      if (!res.success) {
        toast.error(res.message)
      } else {
        toast.message(res.message)
        router.push(`/admin/products`)
      }
    }
    if (type === "Update") {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      // For update, 'id' is required and should be present in values due to defaultValues.
      const res = await updateProduct(
        values as z.infer<typeof updateProductSchema>
      )
      if (!res.success) {
        toast.error(res.message)
      } else {
        router.push(`/admin/products`)
      }
    }
  }
  const images = useWatch({ control: form.control, name: "images" }) || []
  const isFeatured = useWatch({ control: form.control, name: "isFeatured" })
  const banner = useWatch({ control: form.control, name: "banner" })

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter product slug"
                      className="pl-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        )
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product price"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product stock"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="mt-2 min-h-48 space-y-2">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="h-20 w-20 rounded-sm object-cover object-center"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            if (res && res.length > 0) {
                              form.setValue("images", [
                                ...(images || []),
                                res[0].url,
                              ])
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`)
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          Featured Product
          <Card>
            <CardContent className="mt-2 space-y-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className="w-full rounded-sm object-cover object-center"
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    if (res && res.length > 0) {
                      form.setValue("banner", res[0].url)
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`)
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
