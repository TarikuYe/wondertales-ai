import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type LucideIcon, Plus, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats?: { label: string; value: string }[];
  tableHeaders?: string[];
  tableRows?: string[][];
  ctaLabel?: string;
}

export function AdminPlaceholder({ title, description, icon: Icon, stats, tableHeaders, tableRows, ctaLabel }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 size-4" /> Export</Button>
          {ctaLabel && <Button variant="hero" size="sm"><Plus className="mr-2 size-4" /> {ctaLabel}</Button>}
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder={`Search ${title.toLowerCase()}…`} className="pl-9" />
            </div>
          </div>

          {tableHeaders && tableRows ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                    {tableHeaders.map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-slate-600 dark:text-slate-400">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Icon className="mb-3 size-12 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No data available yet</p>
              <p className="text-xs text-slate-400">This section will populate as the platform grows.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
