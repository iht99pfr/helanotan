"use client";

import { useState } from "react";
import { track } from "@/app/lib/track";

/**
 * Native share first: Swedish family decisions travel one-to-one through
 * Messenger, WhatsApp and SMS, which is what the OS sheet opens. The copy
 * fallback serves desktop. No platform broadcast buttons — the recipient is
 * a partner, not an audience.
 */
export default function ShareValuation({ label, year, estimate }: {
  label: string; year: number; estimate: number | null;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const text = estimate != null
      ? `${label} ${year} — prisestimat ${estimate.toLocaleString("sv-SE")} kr enligt Hela Notan`
      : `${label} ${year} — värdering från Hela Notan`;
    track("share_click", { page: "vardera", channel: "native" });
    if (navigator.share) {
      try { await navigator.share({ title: text, text, url }); } catch { /* avbruten */ }
      return;
    }
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={share}
      className="px-4 py-2 rounded-lg bg-[var(--foreground)] text-white text-sm font-medium hover:opacity-90 transition"
    >
      {copied ? "Länk kopierad" : "Dela värderingen"}
    </button>
  );
}
