"use client";

import dynamic from "next/dynamic";

const CodeBlock = dynamic(
  () => import("@/components/blog/CodeBlock").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <pre className="my-6 overflow-x-auto rounded-xl border border-card-border bg-card p-4 text-sm animate-pulse" />
    ),
  }
);

export { CodeBlock };
