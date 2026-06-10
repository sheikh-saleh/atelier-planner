import type { ProjectBrief, ProjectBriefContent } from "@/lib/types";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "atelier-planner-briefs";

function loadLocal(): ProjectBrief[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(briefs: ProjectBrief[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
}

export function getLocalBriefs(): ProjectBrief[] {
  return loadLocal();
}

export function saveLocalBrief(
  idea: string,
  content: ProjectBriefContent,
  briefId?: string,
): ProjectBrief {
  const briefs = loadLocal();
  const now = new Date().toISOString();

  if (briefId) {
    const idx = briefs.findIndex((b) => b.id === briefId);
    if (idx !== -1) {
      briefs[idx] = { ...briefs[idx], idea, content, updatedAt: now };
      saveLocal(briefs);
      return briefs[idx];
    }
  }

  const brief: ProjectBrief = {
    id: uid(),
    userId: "local",
    idea,
    content,
    createdAt: now,
    updatedAt: now,
  };
  briefs.unshift(brief);
  saveLocal(briefs);
  return brief;
}

export function deleteLocalBrief(briefId: string) {
  const briefs = loadLocal().filter((b) => b.id !== briefId);
  saveLocal(briefs);
}
