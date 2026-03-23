"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const currentTheme = resolvedTheme === "light" ? vs : vscDarkPlus;

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-card-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-card-border bg-background/50 px-4 py-2">
        <span className="font-mono text-xs text-brand-text/60 lowercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-background/50 text-brand-text/50 transition-colors hover:bg-brand-primary/20 hover:text-brand-primary"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <div className="overflow-x-auto text-[13px]">
        <SyntaxHighlighter
          language={language}
          style={currentTheme}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "inherit",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
