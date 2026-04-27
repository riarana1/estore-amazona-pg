import { Metadata } from "next"
import ShippingAddressForm from "./shipping-address-form"
import { APP_NAME } from "@/lib/constants"
import { redirect } from "next/navigation"
import { getMyCart } from "@/lib/actions/cart.actions"
import { auth } from "@/auth"
import { getUserById } from "@/lib/actions/user.actions"

export const metadata: Metadata = {
  title: `Shipping Address - ${APP_NAME}`,
}

export default async function ShippingPage() {
  const cart = await getMyCart()
  if (!cart || cart.items.length === 0) redirect("/cart")
  const session = await auth()
  const user = await getUserById(session!.user.id!)
  return <ShippingAddressForm address={user.address} />
}
