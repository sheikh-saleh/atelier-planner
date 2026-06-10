"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { ProjectBriefContent } from "@/lib/types";
import { Copy, Check } from "lucide-react";

interface PromptCompilerProps {
  idea: string;
  content: ProjectBriefContent;
}

function compilePrompt(idea: string, content: ProjectBriefContent): string {
  return `I want to build: ${idea}

## App Summary
${content.summary || "Not specified"}

## Target Users
${content.targetUsers || "Not specified"}

## Core Features
${content.coreFeatures || "Not specified"}

## Tech Stack
${content.techStack || "Not specified"}

## Pages / Routes
${content.routes || "Not specified"}

## Data Model
${content.dataModel || "Not specified"}

## Build Phases
${content.phases || "Not specified"}

## Risks & Edge Cases
${content.risks || "Not specified"}

---

Please act as a Senior Software Architect. Using the details above, provide a comprehensive implementation plan covering architecture, component tree, data flow, route design, state management, testing strategy, and deployment considerations.`;
}

export function PromptCompiler({ idea, content }: PromptCompilerProps) {
  const [copied, setCopied] = useState(false);

  const prompt = compilePrompt(idea, content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-[var(--fg)]">Starter Prompt</h3>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">
              Copy this to use with any coding agent to begin implementation
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
        <Textarea
          value={prompt}
          readOnly
          rows={10}
          className="text-xs font-mono leading-relaxed"
        />
      </div>
    </Card>
  );
}
