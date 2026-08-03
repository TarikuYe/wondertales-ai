import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getAdminStories, deleteStory, updateStoryStatus } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Search, Loader as Loader2, Trash2, CircleCheck as CheckCircle2, Circle as XCircle, Eye, Download, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/stories")({
  head: () => ({ meta: [{ title: "Stories — TeretVerse Admin" }] }),
  component: StoryManagement,
});

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  generating: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  archived: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function StoryManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const pageSize = 12;
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["admin-stories", statusFilter],
    queryFn: () => getAdminStories({ data: { limit: 200, status: statusFilter !== "all" ? statusFilter : undefined } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId: string) => deleteStory({ data: { storyId } }),
    onSuccess: () => {
      toast.success("Story deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      setSelectedStory(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ storyId, status }: { storyId: string; status: string }) =>
      updateStoryStatus({ data: { storyId, status } }),
    onSuccess: () => {
      toast.success("Story status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = stories.filter((s: any) => {
    const matchesSearch =
      !search ||
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Story Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} stories · review, approve, reject, or delete
        </p>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by title or ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-amber-500" />
        </div>
      ) : paginated.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <BookOpen className="mb-3 size-12 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No stories found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((story: any) => (
              <Card key={story.id} className="group overflow-hidden border-slate-200 dark:border-slate-800">
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="size-10 text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-2 right-2 rounded-md px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[story.status] || ""}`}>
                    {story.status}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="truncate font-bold text-slate-900 dark:text-white">{story.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{story.genre}</Badge>
                    <Badge variant="outline" className="text-[10px]">{story.illustrationStyle}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="size-3" /> {story.pageCount} pages
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3" /> {story.vocabularyCount} words
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedStory(story)}>
                      <Eye className="mr-1 size-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      onClick={() => {
                        if (confirm(`Delete "${story.title}"?`)) deleteMutation.mutate(story.id);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="size-4" /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Story detail dialog */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{selectedStory.title}</DialogTitle>
                <DialogDescription>Story management actions</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800/50">
                  <div><span className="text-xs text-slate-500">Genre</span><p className="font-semibold">{selectedStory.genre}</p></div>
                  <div><span className="text-xs text-slate-500">Style</span><p className="font-semibold">{selectedStory.illustrationStyle}</p></div>
                  <div><span className="text-xs text-slate-500">Pages</span><p className="font-semibold">{selectedStory.pageCount}</p></div>
                  <div><span className="text-xs text-slate-500">Vocab</span><p className="font-semibold">{selectedStory.vocabularyCount} words</p></div>
                  <div><span className="text-xs text-slate-500">Created</span><p className="font-semibold text-xs">{new Date(selectedStory.createdAt).toLocaleString()}</p></div>
                  <div><span className="text-xs text-slate-500">Status</span><p className="font-semibold capitalize">{selectedStory.status}</p></div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => statusMutation.mutate({ storyId: selectedStory.id, status: "archived" })}
                >
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Delete "${selectedStory.title}"?`)) deleteMutation.mutate(selectedStory.id);
                  }}
                >
                  <Trash2 className="mr-2 size-4" /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
