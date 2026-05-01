import { loadStripe } from '@stripe/stripe-js/pure'
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useTheme } from 'next-themes'
import { type SyntheticEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

const StripeForm = ({
  orderId,
  priceInCents,
}: {
  orderId: string
  priceInCents: number
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (stripe == null || elements == null || email == null) return
    setIsLoading(true)
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading
          ? 'Purchasing...'
          : `Purchase - ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  )
}

export default function StripePayment({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number
  orderId: string
  clientSecret: string
}) {
  const { theme, systemTheme } = useTheme()
  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
              ? 'stripe'
              : systemTheme === 'light'
              ? 'stripe'
              : 'night',
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm orderId={orderId} priceInCents={priceInCents} />
    </Elements>
  )
}