"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaField, FormStatus, SuccessPanel, TextField } from "@/components/forms/controls";
import { acceptLead, contactSchema } from "@/lib/leads";

const empty = { name: "", email: "", phone: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function submit() {
    setStatus("loading");
    setMessage("");
    const data = acceptLead(contactSchema, values, "MSG");
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
        title="Message received."
        copy="Someone at the Decatur shop will answer. If the job is ready to price, the estimate form is the faster path."
        onReset={() => {
          setValues(empty);
          setStatus("idle");
          setReference("");
        }}
      />
    );
  }

  const untouched = !values.name && !values.email && !values.phone && !values.message;

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      {untouched && status === "idle" ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
          The form is empty. A name, a way to reply, and a sentence about the job are enough to start.
        </p>
      ) : null}
      <TextField id="name" label="Name" value={values.name} error={errors.name} onChange={(value) => set("name", value)} autoComplete="name" />
      <TextField id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={(value) => set("email", value)} autoComplete="email" />
      <TextField id="phone" label="Phone" type="tel" value={values.phone} error={errors.phone} onChange={(value) => set("phone", value)} autoComplete="tel" />
      <AreaField id="message" label="Message" value={values.message} error={errors.message} onChange={(value) => set("message", value)} placeholder="What should we know before we call?" />
      <FormStatus status={status} message={message} />
      <Button type="submit" className="h-11 px-5" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
