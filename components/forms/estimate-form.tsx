"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaField, ChoiceField, FormStatus, SuccessPanel, TextField } from "@/components/forms/controls";
import { acceptLead, estimateSchema } from "@/lib/leads";
import { services } from "@/lib/content";

const projectTypes = [...services.map((service) => service.name), "Several of these"];
const timelines = [
  "As soon as the schedule opens",
  "1–3 months",
  "3–6 months",
  "Planning for next season",
];
const budgets = ["Under $25k", "$25k–$75k", "$75k–$150k", "$150k–$400k", "$400k and up", "Not sure yet"];

const empty = {
  projectType: "",
  address: "",
  city: "",
  timeline: "",
  budget: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
};

const stepFields: (keyof typeof empty)[][] = [
  ["projectType"],
  ["address", "city", "timeline", "budget"],
  ["notes"],
  ["name", "email", "phone"],
];

export function EstimateForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate(keys: (keyof typeof empty)[]) {
    const parsed = estimateSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (keys.includes(key as keyof typeof empty) && !next[key]) next[key] = issue.message;
    }
    const relevant = keys.some((key) => next[key]);
    setErrors(next);
    return !relevant;
  }

  async function submit() {
    if (!validate(stepFields[3])) return;
    setStatus("loading");
    setMessage("");
    const data = acceptLead(estimateSchema, values, "EST");
    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      setErrors(data.fieldErrors);
      return;
    }
    setReference(data.reference);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <SuccessPanel
        reference={reference}
        title="Estimate request is in."
        copy="Sofia will read the scope and reply with questions or a site time. Keep this number with your notes."
        onReset={() => {
          setValues(empty);
          setStep(0);
          setStatus("idle");
          setReference("");
        }}
      />
    );
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 3) {
          if (validate(stepFields[step])) setStep((current) => current + 1);
          return;
        }
        void submit();
      }}
    >
      <div className="flex gap-2" aria-hidden>
        {stepFields.map((_, index) => (
          <span
            key={index}
            className={index <= step ? "h-1 flex-1 bg-copper" : "h-1 flex-1 bg-border"}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Step {step + 1} of 4</p>
      <div key={step} className="motion-step grid gap-4">
          {step === 0 && (
            <ChoiceField
              id="projectType"
              label="Project type"
              placeholder="What are we building?"
              value={values.projectType}
              options={projectTypes}
              error={errors.projectType}
              onChange={(value) => set("projectType", value)}
            />
          )}
          {step === 1 && (
            <>
              <TextField id="address" label="Job address" value={values.address} error={errors.address} onChange={(value) => set("address", value)} autoComplete="street-address" />
              <TextField id="city" label="City" value={values.city} error={errors.city} onChange={(value) => set("city", value)} autoComplete="address-level2" />
              <ChoiceField id="timeline" label="Timeline" placeholder="When should this start?" value={values.timeline} options={timelines} error={errors.timeline} onChange={(value) => set("timeline", value)} />
              <ChoiceField id="budget" label="Budget range" placeholder="A range is enough" value={values.budget} options={budgets} error={errors.budget} onChange={(value) => set("budget", value)} />
            </>
          )}
          {step === 2 && (
            <AreaField
              id="notes"
              label="Scope notes"
              placeholder="What is there now, and what do you want standing when we leave?"
              value={values.notes}
              error={errors.notes}
              onChange={(value) => set("notes", value)}
            />
          )}
          {step === 3 && (
            <>
              <TextField id="name" label="Name" value={values.name} error={errors.name} onChange={(value) => set("name", value)} autoComplete="name" />
              <TextField id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={(value) => set("email", value)} autoComplete="email" />
              <TextField id="phone" label="Phone" type="tel" value={values.phone} error={errors.phone} onChange={(value) => set("phone", value)} autoComplete="tel" />
            </>
          )}
      </div>
      <FormStatus status={status} message={message} />
      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" className="h-11 px-5" onClick={() => setStep((current) => current - 1)}>
            Back
          </Button>
        )}
        <Button type="submit" className="h-11 px-5" disabled={status === "loading"}>
          {step < 3 ? "Continue" : status === "loading" ? "Sending…" : "Submit estimate"}
        </Button>
      </div>
    </form>
  );
}
