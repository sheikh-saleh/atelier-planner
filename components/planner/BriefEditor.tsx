"use client";

import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import type { ProjectBriefContent } from "@/lib/types";

interface SectionDef {
  key: keyof ProjectBriefContent;
  label: string;
  description: string;
}

const SECTIONS: SectionDef[] = [
  { key: "summary", label: "Summary", description: "A concise description of the app" },
  { key: "targetUsers", label: "Target Users", description: "Who this app is for" },
  { key: "coreFeatures", label: "Core Features", description: "Key functionality of the app" },
  { key: "techStack", label: "Tech Stack", description: "Recommended technologies and reasoning" },
  { key: "routes", label: "Pages / Routes", description: "Every page or route the app needs" },
  { key: "dataModel", label: "Data Model", description: "Key entities and their relationships" },
  { key: "phases", label: "Build Phases", description: "MVP through polish" },
  { key: "risks", label: "Risks & Edge Cases", description: "Technical risks and edge cases" },
];

interface BriefEditorProps {
  content: ProjectBriefContent;
  onChange: (content: ProjectBriefContent) => void;
}

export function BriefEditor({ content, onChange }: BriefEditorProps) {
  const update = (key: keyof ProjectBriefContent, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
      {SECTIONS.map(({ key, label, description }) => (
        <Card key={key} className="sm:col-span-2">
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-[var(--fg)]">{label}</span>
              <span className="block text-xs text-[var(--fg-muted)] mt-0.5">{description}</span>
            </label>
            <Textarea
              value={content[key]}
              onChange={(e) => update(key, e.target.value)}
              rows={4}
              className="text-sm"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
