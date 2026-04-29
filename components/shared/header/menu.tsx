import { EllipsisVertical } from "lucide-react"

import CartButton from "./cart-button"
import UserButton from "./user-button"

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  return (
    <div className="flex justify-end">
      <nav className="hidden w-full gap-3 md:flex">
        <UserButton />
        {forAdmin ? null : <CartButton />}
      </nav>
      <nav className="md:hidden">
        <EllipsisVertical className="h-6 w-6" />
        <UserButton />
        <CartButton />
      </nav>
    </div>
  )
}

export default Menu
