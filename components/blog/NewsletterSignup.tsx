"use client";

import { FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setStatus("success");
      setMessage("Subscribed successfully. Watch your inbox.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not subscribe.");
    }
  }

  return (
    <section className="rounded-2xl border border-card-border bg-card p-6 md:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary">Newsletter</p>
      <h3 className="mt-3 text-2xl font-bold md:text-3xl">Operational Insights</h3>
      <p className="mt-3 text-brand-text/65">
        Weekly editorial from EdgeOps Labs. New posts with <code>newsletter: true</code> are mailed automatically.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="h-12 flex-1 rounded-xl border border-card-border bg-background px-4 text-sm outline-none transition-colors focus:border-brand-primary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-12 rounded-xl border border-brand-primary/60 bg-brand-primary/10 px-5 font-mono text-sm uppercase tracking-wider transition-colors hover:bg-brand-primary/20 disabled:opacity-70"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message ? (
        <p className={`mt-3 text-sm ${status === "success" ? "text-brand-primary" : "text-red-400"}`}>{message}</p>
      ) : null}
    </section>
  );
}
