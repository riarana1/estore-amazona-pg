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
      <Link href="/api/auth/signin">
        <Button>Sign In</Button>
      </Link>
    )
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative ml-2 h-8 w-8 rounded-full"
          >
            {session.user.name
              ? session.user.name.charAt(0).toUpperCase()
              : "U"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/orders">
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
                className="h-auto w-full justify-start px-2 py-4"
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
