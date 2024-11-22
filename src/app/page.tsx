import { StatusChart } from "@/components/status/status-chart";
import { getIncidents } from "@/lib/actions/incidents-api";
import { getStatusChecks } from "@/lib/actions/status-checks-api";
import { StatusDataProvider } from "@/lib/hooks/use-status-data";

// disable caching for this page to ensure we always get the latest data
export const fetchCache = "force-no-store";

export default async function Index() {
  const statusCheckRes = await getStatusChecks();

  const incidentRes = await getIncidents();

  if (statusCheckRes.type === "error" || incidentRes.type === "error") {
    return <div>Error fetching data</div>;
  }

  return (
    <StatusDataProvider
      initialData={{
        statusChecks: statusCheckRes.status_checks,
        incidents: incidentRes.incidents,
      }}
    >
      <div className="py-12 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold">Latency</h1>

        <StatusChart statusChecks={statusCheckRes.status_checks} />
      </div>
    </StatusDataProvider>
  );
}
