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
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return <OrderDetailsForm order={order} />
}

export default OrderDetailsPage
