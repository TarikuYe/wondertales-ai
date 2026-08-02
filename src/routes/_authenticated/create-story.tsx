import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import type { StoryGenre, IllustrationStyle, VoiceType } from "@/types/story";
import { generateStory } from "@/lib/stories";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/create-story")({
  head: () => ({
    meta: [
      { title: "Create a Story — TeretVerse" },
      { name: "description", content: "Generate a magical personalized story for your child." },
    ],
  }),
  component: CreateStory,
});

const GENRES: StoryGenre[] = ["Bedtime", "Adventure", "Animals", "Fantasy", "Space", "Ocean", "Dinosaurs", "World Folktales", "STEM", "Kindness", "Big Feelings", "Friendship", "Healthy Habits"];
const STYLES: IllustrationStyle[] = ["Storybook", "Watercolor", "Soft Cartoon", "Paper Cut", "3D Cartoon", "Fantasy", "Animal World", "Nature"];
const VOICES: VoiceType[] = ["Grandmother", "Friendly Dad", "Young Girl", "Wizard", "Pirate", "Robot"];

import { useQuery } from "@tanstack/react-query";
import { getChildren } from "@/lib/children";

function CreateStory() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch children for selection
  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ["children"],
    queryFn: () => getChildren(),
  });

  // Form State
  const [selectedChildId, setSelectedChildId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeChildId") || "";
    }
    return "";
  });
  const [genre, setGenre] = useState<StoryGenre>("Adventure");
  const [style, setStyle] = useState<IllustrationStyle>("Storybook");
  const [voice, setVoice] = useState<VoiceType>("Friendly Dad");
  const [lesson, setLesson] = useState("");
  const [theme, setTheme] = useState("");

  // Sync default selection once children load
  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id || "");
    }
  }, [children, selectedChildId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) {
      alert("Please select a child profile first.");
      return;
    }
    setIsGenerating(true);
    
    try {
      const response = await generateStory({
        data: {
          childId: selectedChildId,
          age: children.find(c => c.id === selectedChildId)?.age || 5,
          length: "Medium (20-30 pages)", // Default for now
          genre,
          illustrationStyle: style,
          voice,
          lesson: lesson ? lesson.trim() : "",
          customTheme: theme ? theme.trim() : "",
        }
      });
      
      // Save selected child id as active
      localStorage.setItem('activeChildId', selectedChildId);
      navigate({ to: "/" }); // Go to kids library to watch progress
    } catch (error) {
      console.error("Failed to generate story:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground pb-20">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-5 py-3 sm:px-8">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link to="/dashboard">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="font-display text-lg font-bold">{t('createStory.title')}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        <form onSubmit={handleGenerate}>
          <Card className="border-border shadow-soft overflow-hidden">
            <div className="h-2 w-full bg-gradient-magic" />
            <CardHeader>
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                <Wand2 className="size-6 text-accent" /> {t('createStory.settings')}
              </CardTitle>
              <CardDescription>{t('createStory.desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label htmlFor="childSelect">{t('createStory.whichChild')}</Label>
                <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                  <SelectTrigger id="childSelect" className="h-11">
                    <SelectValue placeholder={t('createStory.selectChild')} />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((c: any) => (
                      <SelectItem key={c.id} value={c.id!}>
                        <span className="mr-2">{c.avatar || '🐣'}</span>
                        <span>{c.name} (Age {c.age})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {children.length === 0 && !isLoadingChildren && (
                  <p className="text-xs text-rose-400">
                    {t('createStory.noChild')} <Link to="/children" className="underline font-semibold">{t('createStory.createOne')}</Link>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="genre">{t('createStory.genre')}</Label>
                <Select value={genre} onValueChange={(v) => setGenre(v as StoryGenre)}>
                  <SelectTrigger id="genre" className="h-11">
                    <SelectValue placeholder={t('createStory.selectGenre')} />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="theme">{t('createStory.theme')} <span className="text-muted-foreground font-normal">{t('createStory.optional')}</span></Label>
                <Textarea 
                  id="theme" 
                  placeholder={t('createStory.themePlaceholder')}
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="resize-none h-20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="lesson">{t('createStory.lesson')} <span className="text-muted-foreground font-normal">{t('createStory.optional')}</span></Label>
                <Input 
                  id="lesson" 
                  placeholder={t('createStory.lessonPlaceholder')}
                  value={lesson}
                  onChange={e => setLesson(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div className="space-y-3">
                  <Label htmlFor="style">{t('createStory.style')}</Label>
                  <Select value={style} onValueChange={(v) => setStyle(v as IllustrationStyle)}>
                    <SelectTrigger id="style" className="h-11">
                      <SelectValue placeholder={t('createStory.selectStyle')} />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="voice">{t('createStory.voice')}</Label>
                  <Select value={voice} onValueChange={(v) => setVoice(v as VoiceType)}>
                    <SelectTrigger id="voice" className="h-11">
                      <SelectValue placeholder={t('createStory.selectVoice')} />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICES.map(v => (
                        <SelectItem key={v} value={v}>{t(`voices.${v.toLowerCase().replace(" ", "")}`, { defaultValue: v })}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border flex justify-end gap-3 py-4">
              <Button type="button" variant="ghost" asChild>
                <Link to="/">{t('createStory.cancel')}</Link>
              </Button>
              <Button 
                type="submit" 
                variant="hero"
                disabled={isGenerating || children.length === 0}
                className="gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-indigo-950 font-bold w-48"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="size-4 fill-indigo-950 animate-pulse" />
                    {t('createStory.generating')}
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" />
                    {t('createStory.create')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
