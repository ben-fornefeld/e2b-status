import { StatusChart } from "@/components/status/status-chart";
import { getStatusChecks } from "@/lib/actions/status-checks-api";

// disable caching for this page to ensure we always get the latest data
export const fetchCache = "force-no-store";

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
