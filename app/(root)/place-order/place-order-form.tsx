"use client"

import { Check, Loader } from "lucide-react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { createOrder } from "@/lib/actions/order.actions"

const PlaceOrderButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} className="w-full">
      {pending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}{" "}
      Place Order
    </Button>
  )
}

export default function PlaceOrderForm() {
  const [data, action] = useActionState(createOrder, {
    success: false,
    message: "",
  })

  return (
    <form action={action} className="w-full">
      <PlaceOrderButton />
      {!data.success && <p className="py-4 text-destructive">{data.message}</p>}
    </form>
  )
}
