"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import type { ProjectBriefContent, ProjectBrief } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/v1",
  apiKey: process.env.OLLAMA_API_KEY ?? "",
});

const model = ollama(process.env.OLLAMA_MODEL ?? "gemma3:12b");

const SYSTEM_PROMPT = `You are a senior software architect. Given a rough app idea, produce a concise project brief.

Respond with ONLY a valid JSON object (no markdown, no backticks, no extra text) with these 8 keys:

{
  "summary": "2-3 sentence app summary",
  "targetUsers": "Who the app is for, with demographics",
  "coreFeatures": "Bullet list of 4-6 specific core features",
  "techStack": "Recommended stack with brief reasoning for each choice",
  "routes": "Every page/route the app needs",
  "dataModel": "Key entities, their fields, and relationships",
  "phases": "Build phases from MVP to polish with specific deliverables",
  "risks": "Edge cases, technical risks, and mitigations"
}

Fill EVERY key with substantive content. Nothing should be empty or 'Not specified'.`;

export async function generateBrief(idea: string): Promise<{
  content?: ProjectBriefContent;
  error?: string;
}> {
  try {
    const { text } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: `App idea: ${idea}`,
      temperature: 0.7,
      providerOptions: {
        openai: { maxTokens: 8192 },
      },
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0].trim() : text.trim();
    const parsed = JSON.parse(jsonStr);

    const content: ProjectBriefContent = {} as ProjectBriefContent;
    const required: (keyof ProjectBriefContent)[] = [
      "summary", "targetUsers", "coreFeatures", "techStack",
      "routes", "dataModel", "phases", "risks",
    ];

    for (const key of required) {
      const val = parsed[key];
      if (val == null) {
        content[key] = "Not specified";
      } else if (typeof val === "string") {
        content[key] = val;
      } else if (Array.isArray(val)) {
        content[key] = val
          .map((item: unknown) =>
            typeof item === "object" && item !== null
              ? JSON.stringify(item, null, 2)
              : "• " + String(item),
          )
          .join("\n");
      } else if (typeof val === "object") {
        content[key] = JSON.stringify(val, null, 2).replace(/^[{\]]$/, "").trim();
      } else {
        content[key] = String(val);
      }
    }

    return { content };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate brief";
    return { error: message };
  }
}

function authedClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );
}

export async function saveBrief(
  userId: string,
  idea: string,
  content: ProjectBriefContent,
  accessToken: string,
  briefId?: string,
): Promise<{ brief?: ProjectBrief; error?: string }> {
  try {
    const db = authedClient(accessToken);

    if (briefId) {
      const { data, error } = await db
        .from("project_briefs")
        .update({ idea, content, updated_at: new Date().toISOString() })
        .eq("id", briefId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) return { error: error.message };
      return { brief: mapBrief(data) };
    }

    const { data, error } = await db
      .from("project_briefs")
      .insert({ user_id: userId, idea, content })
      .select()
      .single();

    if (error) return { error: error.message };
    return { brief: mapBrief(data) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save brief";
    return { error: message };
  }
}

export async function getBriefs(
  userId: string,
  accessToken: string,
): Promise<{
  briefs?: ProjectBrief[];
  error?: string;
}> {
  try {
    const db = authedClient(accessToken);

    const { data, error } = await db
      .from("project_briefs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { briefs: data.map(mapBrief) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load briefs";
    return { error: message };
  }
}

export async function deleteBrief(
  briefId: string,
  userId: string,
  accessToken: string,
): Promise<{ error?: string }> {
  try {
    const db = authedClient(accessToken);

    const { error } = await db
      .from("project_briefs")
      .delete()
      .eq("id", briefId)
      .eq("user_id", userId);

    if (error) return { error: error.message };
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete brief";
    return { error: message };
  }
}

function mapBrief(data: any): ProjectBrief {
  return {
    id: data.id,
    userId: data.user_id,
    idea: data.idea,
    content: data.content as ProjectBriefContent,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
