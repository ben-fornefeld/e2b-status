import { Incident } from "@/types/incident";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard = ({ incident }: IncidentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{incident.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{incident.description}</p>
      </CardContent>
    </Card>
  );
};
