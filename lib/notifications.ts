export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendNotification(title: string, body?: string, enabled: boolean = true): void {
  if (!enabled) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.svg" });
  } catch {
    // ignore
  }
}

export function playChime(): void {
  playTimerSound("chime");
}

export function playTimerSound(type?: "chime" | "bell" | "digital" | "gong"): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const playTone = (freq: number, start: number, duration: number, vol = 0.18, oscType: OscillatorType = "sine", attack = 0.02) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = oscType;
      
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    const soundMode = type || "chime";

    if (soundMode === "chime") {
      playTone(880, 0, 0.4);
      playTone(1320, 0.18, 0.6);
    } else if (soundMode === "bell") {
      // Metallic strike: fundamental + high overtones with rapid decay
      playTone(987.77, 0, 1.2, 0.25, "sine", 0.005);
      playTone(1479.98, 0, 0.8, 0.12, "sine", 0.005);
      playTone(1975.53, 0, 0.5, 0.06, "sine", 0.005);
      playTone(2489.02, 0, 0.3, 0.03, "sine", 0.005);
    } else if (soundMode === "digital") {
      // Double retro beep
      playTone(1800, 0, 0.08, 0.15, "triangle", 0.005);
      playTone(1800, 0.12, 0.08, 0.15, "triangle", 0.005);
      playTone(1800, 0.24, 0.15, 0.15, "triangle", 0.005);
    } else if (soundMode === "gong") {
      // Deep resonance: lower frequencies, slower attack
      playTone(220, 0, 2.0, 0.3, "sine", 0.1);
      playTone(275, 0.02, 1.8, 0.15, "sine", 0.1);
      playTone(330, 0.04, 1.6, 0.1, "sine", 0.1);
      playTone(440, 0.06, 1.2, 0.05, "sine", 0.1);
    }
  } catch {
    // ignore
  }
}
