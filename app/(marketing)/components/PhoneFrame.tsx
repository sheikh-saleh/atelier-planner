import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  src: string;
  alt: string;
  className?: string;
  tilt?: "left" | "right" | "none";
}

export function PhoneFrame({ src, alt, className, tilt = "none" }: PhoneFrameProps) {
  const tiltClass =
    tilt === "left"
      ? "-rotate-3"
      : tilt === "right"
        ? "rotate-3"
        : "";

  return (
    <div
      className={cn("relative mx-auto", tiltClass, className)}
      style={{
        width: "100%",
        maxWidth: 320,
        aspectRatio: "390 / 844",
        filter: "drop-shadow(0 30px 50px rgba(44, 42, 38, 0.18))",
      }}
    >
      <div
        className="absolute inset-0 rounded-[3rem] p-2"
        style={{
          background: "var(--ink-500)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(44, 42, 38, 0.25)",
        }}
      >
        <div
          className="relative w-full h-full rounded-[2.4rem] overflow-hidden"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10"
            style={{ background: "var(--ink-500)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
