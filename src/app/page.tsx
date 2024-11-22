import { StatusIndicator } from "@/components/global/status-indicator";
import { StatusChart } from "@/components/status/status-chart";
import { Badge } from "@/components/ui/badge";
import { getStatusChecks } from "@/lib/actions/status-checks-api";

export default async function Index() {
  const data = await getStatusChecks();

  if (data.type === "error") {
    return <div>{data.message}</div>;
  }

  return (
    <div className="py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">Latency</h1>

      <StatusChart statusChecks={data.status_checks} />
    </div>
  );
}
