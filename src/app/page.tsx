import IncidentsList from "@/components/incidents/incidents-list";
import StatusChart from "@/components/status/status-chart";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col gap-8 py-12">
        <StatusChart />

        <IncidentsList />
      </div>
    </StatusDataProvider>
  );
}
