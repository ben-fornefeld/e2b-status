import Link from "next/link";
import UserAvatar from "./user-avatar";
import { Logo } from "./logo";
import { Badge } from "../ui/badge";
import { StatusIndicator } from "./status-indicator";

// TODO: find a way to get overall operational status here

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center">
          <Link href={"/"} className="h-7 w-20">
            <Logo />
          </Link>

          <Badge variant="outline">
            <StatusIndicator status="operational" /> All Systems Operational
          </Badge>
        </div>

        <UserAvatar />
      </div>
    </nav>
  );
}
