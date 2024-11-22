import IncidentsList from "@/components/incidents/incidents-list";
import StatusChart from "@/components/status/status-chart";
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
      {/* h1 only present for SEO purposes */}
      <h1 className="sr-only">Current Api Status</h1>
      <div className="py-12 flex flex-col gap-8">
        <h2 className="text-2xl font-semibold">Latency</h2>

        <StatusChart />

        <h2 className="text-2xl font-semibold mt-8">Recent Incidents</h2>

        <IncidentsList />
      </div>
    </StatusDataProvider>
  );
}
