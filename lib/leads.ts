import { z } from "zod";

const email = z
  .string()
  .trim()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email.");

const phone = z.string().trim().min(7, "Enter a phone number.");
const person = z.string().trim().min(2, "Enter your name.");

export const estimateSchema = z.object({
  projectType: z.string().min(1, "Choose a project type."),
  address: z.string().trim().min(4, "Enter the job address."),
  city: z.string().trim().min(2, "Enter the city."),
  timeline: z.string().min(1, "Choose a timeline."),
  budget: z.string().min(1, "Choose a budget range."),
  notes: z.string().trim().min(12, "Describe the work in a sentence or two."),
  name: person,
  email,
  phone,
});

export const permitSchema = z.object({
  jurisdiction: z.string().min(1, "Choose a jurisdiction."),
  projectType: z.string().min(1, "Choose a project type."),
  drawings: z.string().min(1, "Tell us where the drawings stand."),
  requestType: z.string().min(1, "Choose the kind of help you want."),
  address: z.string().trim().min(4, "Enter the job address."),
  notes: z.string().trim().min(8, "Add a note about the permit."),
  name: person,
  email,
  phone,
});

export const contactSchema = z.object({
  name: person,
  email,
  phone,
  message: z.string().trim().min(12, "Write a short message."),
});

export type EstimateInput = z.infer<typeof estimateSchema>;
export type PermitInput = z.infer<typeof permitSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function referenceCode(prefix: "EST" | "PRM" | "MSG") {
  const salt = Math.floor(1000 + Math.random() * 9000);
  return `HX-${prefix}-${salt}`;
}

export async function deliverLead(kind: string, reference: string, data: unknown) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind,
        reference,
        notify: process.env.LEAD_NOTIFY_EMAIL ?? null,
        data,
      }),
    });
  } catch (error) {
    console.error("Lead webhook failed", reference, error);
  }
}
