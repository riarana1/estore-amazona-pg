import { auth } from "@/auth"
import OrderDetailsForm from "./order-details-form"
import { getOrderById } from "@/lib/actions/order.actions"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Order Details",
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const session = await auth()
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  //const client_secret = null

  return (
    <OrderDetailsForm
      order={order}
      //stripeClientSecret={client_secret}
      isAdmin={session!.user.role === "admin" || false}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
    />
  )
}

export default OrderDetailsPage
