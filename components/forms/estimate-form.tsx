"use client";

import { useState } from "react";
import { Photo } from "@/components/photo";
import { AreaField, ChoiceField, FormStatus, SuccessPanel, TextField } from "@/components/forms/controls";
import { ScopeSheet } from "@/components/forms/scope-sheet";
import { Button } from "@/components/ui/button";
import { designsFor, services, type ServiceSlug } from "@/lib/content";
import { acceptLead, estimateSchema, type EstimateInput } from "@/lib/leads";
import { cn } from "cn";

const timelines = [
  "As soon as the schedule opens",
  "1–3 months",
  "3–6 months",
  "Planning for next season",
];
const budgets = ["Under $25k", "$25k–$75k", "$75k–$150k", "$150k–$400k", "$400k and up", "Not sure yet"];
const stories = ["1 story", "1-1/2 stories", "2 stories", "3 stories"];
const occupied = ["We will be in the house", "The house will be empty", "Only part of the house is occupied"];
const access = ["Street front", "Alley", "Tight lot"];
const hoa = ["No HOA", "HOA or design review", "Not sure"];

const empty: EstimateInput = {
  services: [],
  designs: {},
  area: "",
  stories: "",
  occupied: "",
  access: "",
  hoa: "",
  address: "",
  city: "",
  timeline: "",
  budget: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
};

const stepTitles = [
  "What are we building?",
  "Which design?",
  "Size and the site",
  "Where and when",
  "How to reach you",
  "Review the scope",
];

export function EstimateForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<EstimateInput>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  function set<K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleService(slug: ServiceSlug) {
    setValues((current) => {
      const selected = current.services.includes(slug);
      const servicesNext = selected
        ? current.services.filter((item) => item !== slug)
        : [...current.services, slug];
      const designs = { ...current.designs };
      if (selected) delete designs[slug];
      return { ...current, services: servicesNext, designs };
    });
    setErrors((current) => ({ ...current, services: "", designs: "" }));
  }

  function validate(keys: string[]) {
    const parsed = estimateSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!next[key]) next[key] = issue.message;
    }
    const relevant = keys.some((key) => next[key]);
    setErrors(next);
    return !relevant;
  }

  function submit() {
    const parsed = estimateSchema.safeParse(values);
    if (!parsed.success) {
      setStatus("error");
      setMessage("Check the highlighted fields.");
      return;
    }
    setStatus("loading");
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
      <div className="grid gap-6">
        <SuccessPanel
          reference={reference}
          title="Scope sheet is in."
          copy="Sofia will read this and reply with questions or a site time. The ranges below are allowances, not a bid."
          onReset={() => {
            setValues(empty);
            setStep(0);
            setStatus("idle");
            setReference("");
          }}
        />
        <ScopeSheet values={values} reference={reference} />
      </div>
    );
  }

  const stepKeys = [
    ["services"],
    ["designs"],
    ["area", "stories", "occupied", "access", "hoa"],
    ["address", "city", "timeline", "budget"],
    ["name", "email", "phone"],
    ["services"],
  ];

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 5) {
          if (validate(stepKeys[step])) setStep((current) => current + 1);
          return;
        }
        submit();
      }}
    >
      <div className="flex gap-2" aria-hidden>
        {stepTitles.map((title, index) => (
          <span key={title} className={index <= step ? "h-1 flex-1 bg-copper" : "h-1 flex-1 bg-border"} />
        ))}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Step {step + 1} of {stepTitles.length}</p>
        <h2 className="mt-1 font-heading text-2xl">{stepTitles[step]}</h2>
      </div>
      <div key={step} className="motion-step grid gap-4">
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">Services</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => {
                const on = values.services.includes(service.slug);
                return (
                  <button
                    key={service.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleService(service.slug)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left",
                      on ? "border-copper bg-copper/10" : "border-border",
                    )}
                  >
                    <span className="block font-heading text-xl">{service.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{service.summary}</span>
                  </button>
                );
              })}
            </div>
            {errors.services ? <p className="mt-2 text-sm text-destructive">{errors.services}</p> : null}
          </fieldset>
        )}
        {step === 1 &&
          values.services.map((slug) => {
            const service = services.find((item) => item.slug === slug);
            const options = designsFor(slug as ServiceSlug);
            return (
              <fieldset key={slug}>
                <legend className="font-heading text-xl">{service?.name}</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {options.map((option) => {
                    const on = values.designs[slug] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => set("designs", { ...values.designs, [slug]: option.id })}
                        className={cn(
                          "grid grid-cols-[5.5rem_1fr] gap-3 rounded-xl border p-2 text-left",
                          on ? "border-copper" : "border-border",
                        )}
                      >
                        <span className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Photo src={option.image} alt="" sizes="96px" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{option.name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {option.material} · {option.color}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        {step === 1 && errors.designs ? <p className="text-sm text-destructive">{errors.designs}</p> : null}
        {step === 2 && (
          <>
            <TextField id="area" label="Size" value={values.area} error={errors.area} onChange={(value) => set("area", value)} />
            <p className="-mt-2 text-xs text-muted-foreground">Square feet of frame, wall, deck, or new area. A deck can be “14 x 16”.</p>
            <ChoiceField id="stories" label="Stories" placeholder="How tall is the work?" value={values.stories} options={stories} error={errors.stories} onChange={(value) => set("stories", value)} />
            <ChoiceField id="occupied" label="Occupied" placeholder="Will anyone be living there?" value={values.occupied} options={occupied} error={errors.occupied} onChange={(value) => set("occupied", value)} />
            <ChoiceField id="access" label="Access" placeholder="How do we reach the work?" value={values.access} options={access} error={errors.access} onChange={(value) => set("access", value)} />
            <ChoiceField id="hoa" label="HOA or design review" placeholder="Is there a review board?" value={values.hoa} options={hoa} error={errors.hoa} onChange={(value) => set("hoa", value)} />
          </>
        )}
        {step === 3 && (
          <>
            <TextField id="address" label="Job address" value={values.address} error={errors.address} onChange={(value) => set("address", value)} autoComplete="street-address" />
            <TextField id="city" label="City" value={values.city} error={errors.city} onChange={(value) => set("city", value)} autoComplete="address-level2" />
            <ChoiceField id="timeline" label="Timeline" placeholder="When should this start?" value={values.timeline} options={timelines} error={errors.timeline} onChange={(value) => set("timeline", value)} />
            <ChoiceField id="budget" label="Budget range" placeholder="A range is enough" value={values.budget} options={budgets} error={errors.budget} onChange={(value) => set("budget", value)} />
            <AreaField id="notes" label="Anything the photos will not show" value={values.notes} onChange={(value) => set("notes", value)} placeholder="Soft floors, a tree against the wall, a kitchen you still need at night." />
          </>
        )}
        {step === 4 && (
          <>
            <TextField id="name" label="Name" value={values.name} error={errors.name} onChange={(value) => set("name", value)} autoComplete="name" />
            <TextField id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={(value) => set("email", value)} autoComplete="email" />
            <TextField id="phone" label="Phone" type="tel" value={values.phone} error={errors.phone} onChange={(value) => set("phone", value)} autoComplete="tel" />
          </>
        )}
        {step === 5 && <ScopeSheet values={values} />}
      </div>
      <FormStatus status={status} message={message} />
      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" className="h-11 px-5" onClick={() => setStep((current) => current - 1)}>
            Back
          </Button>
        )}
        <Button type="submit" className="h-11 px-5" disabled={status === "loading"}>
          {step < 5 ? "Continue" : status === "loading" ? "Sending…" : "Submit scope"}
        </Button>
      </div>
    </form>
  );
}
