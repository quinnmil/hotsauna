"use client";

import { useActionState, useEffect, useState } from "react";
import { lightSauna } from "@/app/actions";

const STORAGE_KEY = "hotsauna:name";

export function LightForm({ isLit = false }: { isLit?: boolean }) {
  const [name, setName] = useState("");
  const [, formAction, pending] = useActionState(lightSauna, null);
  const idleLabel = isLit ? "Stoke the fire" : "Light the fire";
  const pendingLabel = isLit ? "Stoking…" : "Lighting…";

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setName(saved);
  }, []);

  const handleSubmit = (formData: FormData) => {
    const value = (formData.get("name") as string | null)?.trim() ?? "";
    if (value) localStorage.setItem(STORAGE_KEY, value);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-3">
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="your name (if you want)"
        maxLength={60}
        disabled={pending}
        autoComplete="given-name"
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-ember px-4 py-4 text-base font-medium text-[#faf6ee] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
      >
        {pending ? pendingLabel : idleLabel}
      </button>
    </form>
  );
}
