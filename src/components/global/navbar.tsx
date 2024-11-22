import Link from "next/link";
import UserAvatar from "./user-avatar";
import { Logo } from "./logo";
import { Badge } from "../ui/badge";
import { StatusIndicator } from "./status-indicator";
import { checkOperationality } from "@/lib/actions/status-checks-api";

export default async function Navbar() {
  const { status } = await checkOperationality();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center">
          <Link href={"/"} className="h-7 w-20">
            <Logo />
          </Link>

          <Badge variant="outline">
            <StatusIndicator status={status} />{" "}
            {status === "operational"
              ? "All Systems Operational"
              : "Some Systems Degraded"}
          </Badge>
        </div>

        <UserAvatar />
      </div>
    </nav>
  );
}
