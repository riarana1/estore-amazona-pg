import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOut } from "@/lib/actions/user.actions"
import ModeToggle from "./mode-toggle"

export default async function UserButton() {
  const session = await auth()
  if (!session)
    return (
      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    )
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative ml-2 h-8 w-8 rounded-full"
          >
            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {session.user.name ?? "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href="/user/profile" className="w-full cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/user/orders" className="w-full cursor-pointer">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user.role === "admin" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="mb-1 p-0">
            <form action={SignOut} className="w-full">
              <Button
                className="h-4 w-full justify-start px-2 py-4"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
