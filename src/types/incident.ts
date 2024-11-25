import { v4 } from "uuid";
import { z } from "zod";

export const IncidentStatusSchema = z.union([
  z.literal("ongoing"),
  z.literal("resolved"),
]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export const IncidentSchema = z.object({
  id: z.string().uuid().default(v4),
  name: z.string(),
  description: z.string(),
  timestamp: z.string().datetime().default(new Date().toISOString()),
});

export type IncidentInput = z.input<typeof IncidentSchema>;

export const IncidentStepSchema = z.object({
  id: z.string().uuid().default(v4),
  incident_id: z.string(),
  text: z.string(),
  status: IncidentStatusSchema,
  timestamp: z.string().datetime().default(new Date().toISOString()),
});

export type Incident = z.infer<typeof IncidentSchema>;

export type IncidentStep = z.infer<typeof IncidentStepSchema>;

export type IncidentStepInput = z.input<typeof IncidentStepSchema>;

export type IncidentWithSteps = Incident & {
  steps: IncidentStep[];
};

/* export type IncidentStepInput = {
  text: string;
  status: IncidentStatus;
}; */
