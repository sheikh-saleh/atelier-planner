"use client";

import { useState } from "react";
import { Bell, BellOff, Download, Upload, Trash2, LogIn, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { useData } from "@/components/providers/DataProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { requestNotificationPermission } from "@/lib/notifications";
import { exportData, importData } from "@/lib/storage";

export function SettingsPanel() {
  const { data, setSettings, resetAll, syncing } = useData();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const handleNotif = async () => {
    if (data.settings.notificationsEnabled) {
      setSettings({ notificationsEnabled: false });
      return;
    }
    const ok = await requestNotificationPermission();
    setSettings({ notificationsEnabled: ok });
  };

  const handleExport = () => {
    const json = exportData(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atelier-planner-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const parsed = importData(importText);
    if (!parsed) {
      alert("Invalid JSON");
      return;
    }
    if (confirm("This will replace all current data. Continue?")) {
      window.localStorage.setItem("atelier-planner-v1", importText);
      window.location.reload();
    }
  };

  return (
    <>
      <Card>
        <h3 className="font-serif text-lg italic mb-4">Account</h3>
        {user ? (
          user.id === "guest-user" ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">Guest Mode (Local Only)</div>
                <div className="text-xs text-[var(--fg-soft)] mt-0.5">
                  Your data is saved in this browser. Create an account to sync across devices.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth">
                  <Button variant="primary" className="w-full">
                    <LogIn className="h-3.5 w-3.5" /> Create Account
                  </Button>
                </Link>
                <Button variant="secondary" onClick={() => signOut()} className="w-full">
                  <LogOut className="h-3.5 w-3.5" /> Exit Guest
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="text-xs text-[var(--fg-soft)]">
                    {syncing ? "Syncing…" : "Synced to cloud"}
                  </div>
                </div>
                {syncing && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />}
              </div>
              <Button variant="secondary" onClick={() => signOut()} className="w-full">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[var(--fg-soft)]">
              Sign in to sync your data across devices.
            </p>
            <Link href="/auth">
              <Button variant="primary" className="w-full">
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Button>
            </Link>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-serif text-lg italic mb-4">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-[var(--fg-soft)]">Light or dark interface</div>
            </div>
            <div className="flex rounded-md border p-0.5" style={{ borderColor: "var(--border-soft)" }}>
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 h-8 text-xs font-medium rounded capitalize ${
                    theme === t ? "bg-[var(--accent)] text-cream-50" : "text-[var(--fg-soft)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-[var(--fg-soft)]">
                {data.settings.notificationsEnabled ? "Enabled" : "Off"}
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={handleNotif}>
              {data.settings.notificationsEnabled ? (
                <>
                  <BellOff className="h-3.5 w-3.5" /> Disable
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5" /> Enable
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Sound</div>
              <div className="text-xs text-[var(--fg-soft)]">Chime at end of focus sessions</div>
            </div>
            <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={data.settings.soundEnabled}
                onChange={(e) => setSettings({ soundEnabled: e.target.checked })}
              />
              <span
                className="absolute inset-0 rounded-full transition-colors"
                style={{ background: data.settings.soundEnabled ? "var(--accent)" : "var(--border)" }}
              />
              <span
                className="absolute h-4 w-4 rounded-full bg-cream-50 transition-transform"
                style={{ transform: data.settings.soundEnabled ? "translateX(24px)" : "translateX(4px)" }}
              />
            </label>
          </div>

          {data.settings.soundEnabled && (
            <div className="flex items-center justify-between pl-4 border-l-2 border-[var(--border-soft)] animate-[fade-in_0.2s_ease-out]">
              <div>
                <div className="text-sm font-medium">Sound Profile</div>
                <div className="text-xs text-[var(--fg-soft)]">Select a notification tone</div>
              </div>
              <select
                value={data.settings.soundType ?? "chime"}
                onChange={(e) => setSettings({ soundType: e.target.value as any })}
                className="rounded-md border bg-transparent px-2.5 h-8 text-xs font-medium focus:border-[var(--accent)] focus:outline-none"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              >
                <option value="chime" className="bg-[var(--bg-card)]">Chime</option>
                <option value="bell" className="bg-[var(--bg-card)]">Bell</option>
                <option value="digital" className="bg-[var(--bg-card)]">Digital</option>
                <option value="gong" className="bg-[var(--bg-card)]">Gong</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg italic mb-4">Data</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Erase all data? This cannot be undone.")) {
                resetAll();
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </Card>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import Data" size="md">
        <div className="space-y-3">
          <Label>Paste your exported JSON</Label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="w-full rounded-md border bg-transparent p-3 text-xs font-mono"
            style={{ borderColor: "var(--border)" }}
            placeholder='{"tasks":[],"habits":[],...}'
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleImport}>Replace Data</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
