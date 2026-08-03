import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wrench, Key, Flag, Database, Webhook, Terminal, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/developer")({
  head: () => ({ meta: [{ title: "Developer Tools — TeretVerse Admin" }] }),
  component: DeveloperPage,
});

const featureFlags = [
  { name: "voice_cloning", enabled: true, description: "Premium voice cloning feature" },
  { name: "offline_mode", enabled: false, description: "Download stories for offline reading" },
  { name: "ai_reading_coach", enabled: false, description: "AI listens to child read aloud" },
  { name: "story_branching", enabled: true, description: "Choose-your-own-adventure stories" },
  { name: "parent_voice_recording", enabled: true, description: "Parents record narration" },
];

function DeveloperPage() {
  const [flags, setFlags] = useState(featureFlags);
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Developer Tools</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Feature flags, API keys, webhooks, and logs</p>
      </div>

      {/* Feature Flags */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Flag className="size-5 text-amber-500" /> Feature Flags</CardTitle>
          <CardDescription>Toggle features on or off across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {flags.map((flag, i) => (
            <div key={flag.name} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div>
                <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{flag.name}</p>
                <p className="text-xs text-slate-500">{flag.description}</p>
              </div>
              <Switch
                checked={flag.enabled}
                onCheckedChange={(v) => {
                  setFlags(prev => prev.map((f, idx) => idx === i ? { ...f, enabled: v } : f));
                  toast.success(`${flag.name} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Key className="size-5 text-amber-500" /> API Keys</CardTitle>
          <CardDescription>Manage keys for external services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Gemini API Key", "Firebase Admin Key", "Pollinations API Key"].map((keyName) => (
            <div key={keyName} className="space-y-1.5">
              <Label className="text-xs">{keyName}</Label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  defaultValue="sk-xxxxxxxxxxxxxxxxxxxx"
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Webhook Logs & Cloud Function Logs */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Webhook className="size-5 text-blue-500" /> Webhook Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-emerald-600">POST</span> /webhooks/stripe → <span className="text-slate-500">200 OK (45ms)</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-emerald-600">POST</span> /webhooks/stripe → <span className="text-slate-500">200 OK (32ms)</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-rose-600">POST</span> /webhooks/stripe → <span className="text-rose-500">500 Error (1.2s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Terminal className="size-5 text-purple-500" /> Cloud Function Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-blue-500">[INFO]</span> generateStory: completed in 2.1s
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-amber-500">[WARN]</span> generateStory: Gemini API slow (1.8s)
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-emerald-500">[INFO]</span> verifyChildPin: success
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database & Storage browser */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Database className="size-5 text-indigo-500" /> Firestore Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["profiles", "user_roles", "child_profiles", "stories", "classroom_students", "audit_logs", "reports"].map((col) => (
              <div key={col} className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{col}/</span>
                <Badge variant="secondary">collection</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Wrench className="size-5 text-amber-500" /> Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_PROJECT_ID", "GEMINI_API_KEY", "FIREBASE_SERVICE_ACCOUNT_KEY"].map((env) => (
              <div key={env} className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{env}</span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Set</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
