import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoomEmbedProps {
  url?: string;
  className?: string;
}

export function LoomEmbed({ url, className }: LoomEmbedProps) {
  if (!url) {
    return (
      <div
        className={cn(
          "aspect-video w-full rounded-xl border-2 border-dashed flex items-center justify-center",
          className,
        )}
        style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
      >
        <div className="text-center px-6">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "var(--bg-card)" }}
          >
            <Play className="h-5 w-5 fill-current" style={{ color: "var(--accent)" }} />
          </div>
          <p
            className="font-serif text-base italic"
            style={{ color: "var(--fg-soft)" }}
          >
            30-second demo video
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--fg-muted)" }}>
            A short Loom walkthrough will appear here once recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "aspect-video w-full rounded-xl overflow-hidden border",
        className,
      )}
      style={{ borderColor: "var(--border-soft)" }}
    >
      <iframe
        src={url}
        title="Atelier demo"
        allow="fullscreen; clipboard-write"
        allowFullScreen
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
  );
}
