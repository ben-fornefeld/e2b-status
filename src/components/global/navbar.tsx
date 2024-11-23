import Link from "next/link";
import { Logo } from "./logo";
import { Badge } from "../ui/badge";
import { StatusIndicator } from "./status-indicator";
import { checkOperationality } from "@/lib/actions/status-checks-api";
import DashboardButton from "./dashboard-button";

export default async function Navbar() {
  const { status } = await checkOperationality();

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full justify-center border-b border-border-300 bg-gradient-to-b from-background-300/60 to-background-500/60 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5">
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
