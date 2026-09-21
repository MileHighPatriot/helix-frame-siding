"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className="h-11"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function AreaField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function ChoiceField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || null}
        onValueChange={(next) => onChange(next ?? "")}
      >
        <SelectTrigger id={id} className="h-11 w-full" aria-invalid={Boolean(error)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function FormStatus({
  status,
  message,
}: {
  status: "idle" | "loading" | "error" | "success";
  message?: string;
}) {
  if (status === "loading") {
    return (
      <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="status">
        Sending the request…
      </p>
    );
  }
  if (status === "error" && message) {
    return (
      <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
        {message}
      </p>
    );
  }
  return null;
}

export function SuccessPanel({
  reference,
  title,
  copy,
  onReset,
}: {
  reference: string;
  title: string;
  copy: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-xl border border-copper/40 bg-card p-6" role="status">
      <p className="eyebrow">Received</p>
      <h2 className="mt-3 font-heading text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
      <p className="mt-6 font-heading text-4xl text-copper">{reference}</p>
      <button type="button" className="mt-6 text-sm underline underline-offset-4" onClick={onReset}>
        Start another request
      </button>
    </div>
  );
}
