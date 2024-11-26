import IncidentsList from "@/components/incidents/incidents-list";
import StatusChart from "@/components/status/status-chart";
import { Alert } from "@/components/ui/alert";
import UptimeCard from "@/components/uptime/uptime-card";
import { getIncidents } from "@/lib/actions/incidents-api";
import { getStatusChecks, getUptime } from "@/lib/actions/status-checks-api";
import { StatusDataProvider } from "@/lib/hooks/use-status-data";

// disable caching for this page to ensure we always get the latest data
export const fetchCache = "force-no-store";

export default async function Index() {
  const statusCheckRes = await getStatusChecks();

  const incidentRes = await getIncidents();

  const uptimeRes = await getUptime();

  // TODO: handle errors in component locations
  if (
    statusCheckRes.type === "error" ||
    incidentRes.type === "error" ||
    uptimeRes.type === "error"
  ) {
    return <Alert variant="destructive">Error fetching data</Alert>;
  }

  return (
    <StatusDataProvider
      initialData={{
        statusChecks: statusCheckRes.status_checks,
        incidents: incidentRes.incidents,
        uptime: uptimeRes.uptime,
      }}
    >
      {/* h1 only present for SEO purposes */}
      <h1 className="sr-only">Current Api Status</h1>
      <div className="flex flex-col gap-6 pb-24 pt-8 sm:pt-10">
        <StatusChart />

        <UptimeCard />

        <IncidentsList />
      </div>
    </StatusDataProvider>
  );
}
