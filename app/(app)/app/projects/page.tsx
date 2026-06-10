"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { BriefEditor } from "@/components/planner/BriefEditor";
import { PromptCompiler } from "@/components/planner/PromptCompiler";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ProjectBrief, ProjectBriefContent } from "@/lib/types";
import { Sparkles, Save, Plus, Trash2, Clock, FileText } from "lucide-react";
import { generateBrief, saveBrief, getBriefs, deleteBrief } from "./actions";
import { useHydrated } from "@/hooks/useHydrated";

const EMPTY_CONTENT: ProjectBriefContent = {
  summary: "",
  targetUsers: "",
  coreFeatures: "",
  techStack: "",
  routes: "",
  dataModel: "",
  phases: "",
  risks: "",
};

export default function PlannerPage() {
  const { user } = useAuth();
  const hydrated = useHydrated();
  const [idea, setIdea] = useState("");
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [activeBrief, setActiveBrief] = useState<ProjectBrief | null>(null);
  const [content, setContent] = useState<ProjectBriefContent>(EMPTY_CONTENT);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);

  const userId = user?.id ?? "";

  const loadBriefs = useCallback(async () => {
    if (!userId) return;
    const result = await getBriefs(userId);
    if (result.briefs) setBriefs(result.briefs);
  }, [userId]);

  useEffect(() => {
    if (hydrated && userId) loadBriefs();
  }, [hydrated, userId, loadBriefs]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setGenerating(true);
    setError("");
    setActiveBrief(null);
    setSelectedBriefId(null);

    const result = await generateBrief(idea.trim());
    if (result.error) {
      setError(result.error);
      setGenerating(false);
      return;
    }

    setContent(result.content ?? EMPTY_CONTENT);
    setActiveBrief(null);
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!userId || !idea.trim()) return;
    setSaving(true);
    setError("");

    const result = await saveBrief(userId, idea.trim(), content, selectedBriefId ?? undefined);
    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    if (result.brief) {
      setActiveBrief(result.brief);
      setSelectedBriefId(result.brief.id);
    }
    await loadBriefs();
    setSaving(false);
  };

  const handleSelectBrief = (brief: ProjectBrief) => {
    setActiveBrief(brief);
    setContent(brief.content);
    setIdea(brief.idea);
    setSelectedBriefId(brief.id);
    setError("");
  };

  const handleDeleteBrief = async (briefId: string) => {
    if (!userId) return;
    await deleteBrief(briefId, userId);
    if (selectedBriefId === briefId) {
      setActiveBrief(null);
      setContent(EMPTY_CONTENT);
      setIdea("");
      setSelectedBriefId(null);
    }
    await loadBriefs();
  };

  const handleNew = () => {
    setActiveBrief(null);
    setContent(EMPTY_CONTENT);
    setIdea("");
    setSelectedBriefId(null);
    setError("");
  };

  const hasContent = content.summary || content.coreFeatures || content.techStack;

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <Header title="Projects" />
        <div className="h-32 rounded-xl bg-cream-200 dark:bg-ink-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Header
        title="Projects"
        subtitle="Describe your idea. Get a structured brief. Build with clarity."
      />

      {error && (
        <div
          className="rounded-lg border border-burgundy-300 bg-burgundy-50 p-4 text-sm text-burgundy-600 dark:bg-burgundy-900/20 dark:text-burgundy-300"
        >
          {error}
        </div>
      )}

      {briefs.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-[var(--fg-soft)]" strokeWidth={1.5} />
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--fg-soft)]">
              Previous Briefs
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {briefs.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelectBrief(b)}
                className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  selectedBriefId === b.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--fg)]"
                    : "border-[var(--border-soft)] text-[var(--fg-soft)] hover:border-[var(--accent)] hover:text-[var(--fg)]"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="truncate max-w-32">{b.idea}</span>
                <span
                  onClick={(e) => { e.stopPropagation(); handleDeleteBrief(b.id); }}
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:text-burgundy-500 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wider text-[var(--fg-soft)]">
            What do you want to build?
          </label>
          <Textarea
            placeholder="e.g. A social app for book lovers to share reading lists, write reviews, and form virtual book clubs..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              disabled={generating || !idea.trim()}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {generating ? "Generating..." : "Generate Brief"}
            </Button>
            {hasContent && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
                disabled={saving || !userId}
              >
                <Save className="h-3.5 w-3.5" strokeWidth={1.5} />
                {saving ? "Saving..." : selectedBriefId ? "Update" : "Save"}
              </Button>
            )}
            {activeBrief && (
              <Button variant="ghost" size="sm" onClick={handleNew}>
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                New
              </Button>
            )}
          </div>
        </div>
      </Card>

      {generating && (
        <Card>
          <div className="flex items-center gap-3 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            <p className="text-sm text-[var(--fg-soft)]">
              Analyzing your idea and generating a structured brief...
            </p>
          </div>
        </Card>
      )}

      {hasContent && !generating && (
        <>
          <BriefEditor content={content} onChange={setContent} />
          <PromptCompiler idea={idea} content={content} />
        </>
      )}

      {!hasContent && !generating && (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Sparkles className="h-8 w-8 text-[var(--fg-muted)] mb-3" strokeWidth={1} />
            <p className="text-sm text-[var(--fg-soft)] max-w-md">
              Type your app idea above and click <strong>Generate Brief</strong> to get a
              structured project plan with sections you can edit and save.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
