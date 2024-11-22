import Link from "next/link";
import UserAvatar from "./dashboard-button";
import { Logo } from "./logo";
import { Badge } from "../ui/badge";
import { StatusIndicator } from "./status-indicator";
import { checkOperationality } from "@/lib/actions/status-checks-api";
import DashboardButton from "./dashboard-button";

export default async function Navbar() {
  const { status } = await checkOperationality();

  return (
    <nav className="w-full fixed top-0 flex justify-center border-b border-border-300 bg-gradient-to-b from-background-300/60 to-background-500/60 backdrop-blur-sm h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center">
          <Link href={"/"} className="h-7 w-20">
            <Logo />
          </Link>

          <Badge variant="surface">
            <StatusIndicator status={status} />{" "}
            {status === "operational"
              ? "All Systems Operational"
              : "Some Systems Degraded"}
          </Badge>
        </div>

        <DashboardButton />
      </div>
    </nav>
  );
}
