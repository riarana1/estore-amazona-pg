import Image from "next/image"
import Link from "next/link"
import { APP_NAME } from "@/lib/constants"
import Menu from "./menu"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

const Header = async () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <MenuIcon />
              </Button>
            </DrawerTrigger>
          </Drawer>
          <Link href="/" className="flex-start">
            <Image
              src="/assets/icons/logo.svg"
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
            />
            {APP_NAME}
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  )
}

export default Header
