"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaField, ChoiceField, FormStatus, SuccessPanel, TextField } from "@/components/forms/controls";
import { jurisdictions, services } from "@/lib/content";
import { permitSchema } from "@/lib/leads";

const projectTypes = services.map((service) => service.name);
const drawings = [
  "We have architectural drawings",
  "We have a sketch only",
  "Helix should coordinate drawings",
  "Not sure",
];
const requests = [
  "Pull the permit for us",
  "Review drawings before we submit",
  "Tell us which jurisdiction owns this address",
];

const empty = {
  jurisdiction: "",
  projectType: "",
  drawings: "",
  requestType: "",
  address: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
};

const stepFields: (keyof typeof empty)[][] = [
  ["jurisdiction", "projectType"],
  ["drawings", "requestType", "address"],
  ["notes"],
  ["name", "email", "phone"],
];

export function PermitForm() {
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
    const parsed = permitSchema.safeParse(values);
    if (parsed.success) return true;
    const next: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (keys.includes(key as keyof typeof empty) && !next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return !keys.some((key) => next[key]);
  }

  async function submit() {
    if (!validate(stepFields[3])) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/permits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        message?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok || !data.ok || !data.reference) {
        setStatus("error");
        setMessage(data.message ?? "The permit request could not be sent.");
        setErrors(data.fieldErrors ?? {});
        return;
      }
      setReference(data.reference);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("The shop could not be reached. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <SuccessPanel
        reference={reference}
        title="Permit request is in."
        copy="Evan will confirm the jurisdiction and what still needs an owner signature. Keep this number with the address."
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
          <span key={index} className={index <= step ? "h-1 flex-1 bg-copper" : "h-1 flex-1 bg-border"} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Step {step + 1} of 4</p>
      <div key={step} className="motion-step grid gap-4">
          {step === 0 && (
            <>
              <ChoiceField id="jurisdiction" label="Jurisdiction" placeholder="Where is the property?" value={values.jurisdiction} options={jurisdictions.map((item) => item.name)} error={errors.jurisdiction} onChange={(value) => set("jurisdiction", value)} />
              <ChoiceField id="projectType" label="Project type" placeholder="What needs a permit?" value={values.projectType} options={projectTypes} error={errors.projectType} onChange={(value) => set("projectType", value)} />
            </>
          )}
          {step === 1 && (
            <>
              <ChoiceField id="drawings" label="Drawings" placeholder="What do you have?" value={values.drawings} options={drawings} error={errors.drawings} onChange={(value) => set("drawings", value)} />
              <ChoiceField id="requestType" label="Request" placeholder="What should Helix do?" value={values.requestType} options={requests} error={errors.requestType} onChange={(value) => set("requestType", value)} />
              <TextField id="address" label="Job address" value={values.address} error={errors.address} onChange={(value) => set("address", value)} autoComplete="street-address" />
            </>
          )}
          {step === 2 && (
            <AreaField id="notes" label="Permit notes" placeholder="HOA, prior denial, or a deadline we should know about." value={values.notes} error={errors.notes} onChange={(value) => set("notes", value)} />
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
          {step < 3 ? "Continue" : status === "loading" ? "Sending…" : "Submit permit request"}
        </Button>
      </div>
    </form>
  );
}
