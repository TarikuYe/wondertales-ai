import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CircleCheck as CheckCircle2, Circle as XCircle, Flag, Eye, Ban, TriangleAlert as AlertTriangle, Loader as Loader2, ListFilter as Filter } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({ meta: [{ title: "Content Moderation — TeretVerse Admin" }] }),
  component: ContentModeration,
});

const FLAG_TYPES = [
  { key: "violence", label: "Violence", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
  { key: "hate", label: "Hate Speech", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", icon: ShieldAlert },
  { key: "bullying", label: "Bullying", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertTriangle },
  { key: "adult", label: "Adult Content", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: ShieldAlert },
  { key: "unsafe", label: "Unsafe Topics", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: AlertTriangle },
  { key: "political", label: "Political Content", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Flag },
  { key: "religious", label: "Religious Extremism", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: ShieldAlert },
  { key: "personal_info", label: "Personal Information", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400", icon: AlertTriangle },
  { key: "fake_info", label: "Fake Information", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Flag },
];

const SAMPLE_QUEUE = [
  { id: "1", storyTitle: "The Whispering Woods", type: "violence", content: "The dark creature lunged with sharp claws…", author: "parent_8821", createdAt: "2025-08-02T14:23:00Z", status: "pending" },
  { id: "2", storyTitle: "Space Explorers", type: "unsafe", content: "The rocket exploded near the alien city…", author: "parent_4410", createdAt: "2025-08-02T13:45:00Z", status: "pending" },
  { id: "3", storyTitle: "Kindness Kingdom", type: "bullying", content: "The other kids laughed and pointed at her…", author: "parent_9932", createdAt: "2025-08-02T12:10:00Z", status: "pending" },
  { id: "4", storyTitle: "Ocean Friends", type: "fake_info", content: "Dolphins can breathe fire underwater…", author: "parent_2218", createdAt: "2025-08-02T10:30:00Z", status: "pending" },
];

function ContentModeration() {
  const [filter, setFilter] = useState("all");
  const [queue, setQueue] = useState(SAMPLE_QUEUE);

  const filtered = filter === "all" ? queue : queue.filter((item) => item.type === filter);

  function handleAction(id: string, action: string) {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Content Moderation
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review AI-generated content flagged by the safety pipeline
        </p>
      </div>

      {/* Flag type legend */}
      <div className="flex flex-wrap gap-2">
        {FLAG_TYPES.map((ft) => (
          <span key={ft.key} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${ft.color}`}>
            <ft.icon className="size-3.5" />
            {ft.label}
          </span>
        ))}
      </div>

      {/* Filter bar */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-slate-400" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All flag types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flag Types</SelectItem>
                {FLAG_TYPES.map((ft) => (
                  <SelectItem key={ft.key} value={ft.key}>{ft.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-slate-500">{filtered.length} items in queue</p>
        </CardContent>
      </Card>

      {/* Queue */}
      {filtered.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <CheckCircle2 className="mb-3 size-12 text-emerald-400" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Queue is clear!</p>
            <p className="text-xs text-slate-400">No content needs moderation right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const flagType = FLAG_TYPES.find((ft) => ft.key === item.type);
            const FlagIcon = flagType?.icon;
            return (
              <Card key={item.id} className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${flagType?.color || ""}`}>
                          {FlagIcon && <FlagIcon className="size-3.5" />}
                          {flagType?.label || item.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          Flagged {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{item.storyTitle}</h3>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                        <p className="text-sm italic text-slate-700 dark:text-slate-300">"{item.content}"</p>
                      </div>
                      <p className="text-xs text-slate-500">Author: <span className="font-mono">{item.author}</span></p>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-40">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="mr-2 size-3.5" /> Preview Full
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
                        onClick={() => handleAction(item.id, "approve")}
                      >
                        <CheckCircle2 className="mr-2 size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleAction(item.id, "reject")}
                      >
                        <XCircle className="mr-2 size-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        onClick={() => handleAction(item.id, "flag")}
                      >
                        <Flag className="mr-2 size-3.5" /> Flag User
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
