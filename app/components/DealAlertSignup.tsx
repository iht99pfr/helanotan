"use client";

import { useState } from "react";
import { useModelSelection } from "./ModelSelectionContext";

interface Props {
  dealFilter: string;
}

export default function DealAlertSignup({ dealFilter }: Props) {
  const { selectedModels, modelConfig } = useModelSelection();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!dealFilter) return null;

  const modelLabels = [...selectedModels]
    .map((k) => modelConfig[k]?.label || k)
    .join(", ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/deal-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, modelKeys: [...selectedModels] }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        Tack! Vi meddelar dig när nya fynd dyker upp.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--foreground)] font-medium">
          Få mejl när nya fynd dyker upp
        </p>
        <p className="text-xs text-[var(--muted)] truncate">
          {modelLabels}
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="din@email.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white border border-[var(--border)] px-3 py-2 sm:py-1.5 text-sm rounded-lg min-w-0 flex-1 sm:w-48"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-4 py-2 sm:py-1.5 bg-[var(--foreground)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === "submitting" ? "..." : "Bevaka"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">Något gick fel, försök igen.</p>
      )}
    </form>
  );
}
