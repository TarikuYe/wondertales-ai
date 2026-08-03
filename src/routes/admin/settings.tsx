import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, Globe, Sparkles, Shield, CreditCard, Mail, Palette, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — TeretVerse Admin" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoModeration, setAutoModeration] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [voiceCloning, setVoiceCloning] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure branding, AI models, moderation rules, and subscription plans
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex w-full flex-wrap gap-1">
          <TabsTrigger value="general"><Settings className="mr-1.5 size-4" /> General</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="mr-1.5 size-4" /> Branding</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="mr-1.5 size-4" /> AI Models</TabsTrigger>
          <TabsTrigger value="moderation"><Shield className="mr-1.5 size-4" /> Moderation</TabsTrigger>
          <TabsTrigger value="subscriptions"><CreditCard className="mr-1.5 size-4" /> Subscriptions</TabsTrigger>
          <TabsTrigger value="email"><Mail className="mr-1.5 size-4" /> Email</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>General Configuration</CardTitle><CardDescription>Platform-wide settings and defaults</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="TeretVerse" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" defaultValue="support@teretverse.com" />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue={30} />
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold text-sm">Maintenance Mode</p><p className="text-xs text-slate-500">Temporarily disable user access</p></div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold text-sm">Email Verification</p><p className="text-xs text-slate-500">Require email verification on signup</p></div>
                  <Switch checked={emailVerification} onCheckedChange={setEmailVerification} />
                </div>
              </div>
              <Button variant="hero" onClick={() => toast.success("Settings saved")}><Save className="mr-2 size-4" /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Branding & Appearance</CardTitle><CardDescription>Logo, colors, and visual identity</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input defaultValue="/mascot-wisp.png" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="#f59e0b" />
                    <div className="size-9 rounded-lg border border-slate-200" style={{ background: "#f59e0b" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="#a855f7" />
                    <div className="size-9 rounded-lg border border-slate-200" style={{ background: "#a855f7" }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="hero" onClick={() => toast.success("Branding saved")}><Save className="mr-2 size-4" /> Save Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Models */}
        <TabsContent value="ai">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>AI Model Configuration</CardTitle><CardDescription>Configure text, image, and voice generation providers</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Text Generation Model (Stories & Quizzes)</Label>
                <Select defaultValue="gemini">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Image Generation Provider</Label>
                <Select defaultValue="pollinations">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pollinations">Pollinations.ai (Free)</SelectItem>
                    <SelectItem value="dalle">DALL-E 3</SelectItem>
                    <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Voice / TTS Provider</Label>
                <Select defaultValue="web-speech">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-speech">Web Speech API (Free)</SelectItem>
                    <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                    <SelectItem value="azure">Azure Cognitive Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Story Length</Label>
                <Select defaultValue="medium">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (10-15 pages)</SelectItem>
                    <SelectItem value="medium">Medium (20-30 pages)</SelectItem>
                    <SelectItem value="long">Long (30-40 pages)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <div><p className="font-semibold text-sm">Voice Cloning (Premium)</p><p className="text-xs text-slate-500">Allow parents to clone their voice</p></div>
                <Switch checked={voiceCloning} onCheckedChange={setVoiceCloning} />
              </div>
              <Button variant="hero" onClick={() => toast.success("AI settings saved")}><Save className="mr-2 size-4" /> Save AI Config</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation */}
        <TabsContent value="moderation">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Moderation Rules</CardTitle><CardDescription>Content safety pipeline configuration</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div><p className="font-semibold text-sm">Automatic Moderation</p><p className="text-xs text-slate-500">AI-powered content screening before publishing</p></div>
                <Switch checked={autoModeration} onCheckedChange={setAutoModeration} />
              </div>
              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <Label>Blocked Topics</Label>
                <Textarea
                  defaultValue="violence, hate speech, bullying, adult content, political extremism, religious extremism, personal information, fake information"
                  rows={3}
                />
                <p className="text-xs text-slate-500">Comma-separated list of topics to flag for review.</p>
              </div>
              <div className="space-y-2">
                <Label>Moderation Sensitivity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (fewer flags)</SelectItem>
                    <SelectItem value="medium">Medium (balanced)</SelectItem>
                    <SelectItem value="high">High (more cautious)</SelectItem>
                    <SelectItem value="strict">Strict (child-safe maximum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="hero" onClick={() => toast.success("Moderation rules saved")}><Save className="mr-2 size-4" /> Save Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions */}
        <TabsContent value="subscriptions">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Subscription Plans</CardTitle><CardDescription>Manage pricing tiers and features</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Free", price: "$0", users: "1 child", features: "5 stories/month, basic narration" },
                { name: "Family Premium", price: "$12/mo", users: "6 children", features: "Unlimited stories, all voices, voice cloning" },
                { name: "Teacher & School", price: "Custom", users: "Per classroom", features: "Classrooms, curriculum mapping, progress reports" },
              ].map((plan) => (
                <div key={plan.name} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-slate-500">{plan.price} · {plan.users}</p>
                    </div>
                    <Badge variant="secondary">{plan.features}</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">Edit Plan</Button>
                </div>
              ))}
              <Button variant="hero"><CreditCard className="mr-2 size-4" /> Add New Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Email Templates</CardTitle><CardDescription>Customize transactional emails</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {["Welcome Email", "Password Reset", "Story Ready", "Subscription Renewal", "Payment Failed", "Weekly Progress Report"].map((tpl) => (
                <div key={tpl} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{tpl}</span>
                  <Button size="sm" variant="outline">Edit Template</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
