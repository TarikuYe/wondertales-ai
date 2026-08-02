import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getStories } from "@/lib/stories";
import { getChildren } from "@/lib/children";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Award, 
  RotateCw, 
  CheckCircle2, 
  Loader2, 
  Volume2, 
  Star, 
  Layers,
  Brain
} from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/vocabulary")({
  component: VocabularyVault,
});

function VocabularyVault() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { t } = useTranslation();
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bank" | "flashcards" | "badges">("bank");
  
  // Flashcard game state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveChildId(localStorage.getItem("activeChildId"));
    }
  }, []);

  // Fetch children to get active child's name
  const { data: children = [] } = useQuery({
    queryKey: ["children", user?.uid],
    queryFn: () => getChildren(),
    enabled: !!user,
  });

  const activeChild = children.find((c: any) => c.id === activeChildId);

  // Fetch stories
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories", user?.uid],
    queryFn: () => getStories(),
    enabled: !!user,
  });

  // Filter stories for this child and aggregate vocabulary words
  const childStories = stories.filter((story: any) => {
    if (story.status !== "completed") return false;
    if (!story.childId) return true;
    return story.childId === activeChildId;
  });
  
  // Aggregate vocabulary words across all stories
  const allVocabWords: { word: string; meaning: string; storyTitle: string }[] = [];
  const seenWords = new Set<string>();

  childStories.forEach((story: any) => {
    (story.vocabularyWords || []).forEach((v: any) => {
      const lower = v.word.toLowerCase();
      if (!seenWords.has(lower)) {
        seenWords.add(lower);
        allVocabWords.push({
          word: v.word,
          meaning: v.meaning,
          storyTitle: story.title,
        });
      }
    });
  });

  // Text to Speech for Word Pronunciation
  const speakWord = (word: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8; // Friendly slow rate
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleNextCard = (wordToMarkMastered?: string) => {
    if (wordToMarkMastered && !masteredWords.includes(wordToMarkMastered.toLowerCase())) {
      setMasteredWords(prev => [...prev, wordToMarkMastered.toLowerCase()]);
    }
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % (allVocabWords.length || 1));
    }, 150);
  };

  const childName = activeChild?.name || "Little Hero";
  const childAvatar = activeChild?.avatar || "🐣";

  // Badges calculation
  const totalWordsCount = allVocabWords.length;
  const badges = [
    { title: t('vocab.badge1Title'), desc: t('vocab.badge1Desc'), icon: "🌱", unlocked: totalWordsCount >= 1 },
    { title: t('vocab.badge2Title'), desc: t('vocab.badge2Desc'), icon: "🧭", unlocked: totalWordsCount >= 5 },
    { title: t('vocab.badge3Title'), desc: t('vocab.badge3Desc'), icon: "🧙‍♂️", unlocked: totalWordsCount >= 10 },
    { title: t('vocab.badge4Title'), desc: t('vocab.badge4Desc'), icon: "👑", unlocked: totalWordsCount >= 20 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary)_0.05,transparent_50%)] pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--color-primary)_0.05,transparent_50%)] pointer-events-none opacity-20" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-indigo-950 border-b border-indigo-900 px-6 py-4 text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-xs hover:bg-white/10 text-indigo-200 hover:text-white gap-2"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="size-4" />
            {t('vocab.backToBookshelf')}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{childAvatar}</span>
            <span className="font-display font-bold text-amber-300 text-lg">
              {t('vocab.vaultTitle', { name: childName })}
            </span>
          </div>

          <div className="w-24 text-right">
            <span className="inline-block bg-amber-400 text-indigo-950 font-bold text-xs px-2.5 py-1 rounded-full">
              {t('vocab.wordsCount', { count: totalWordsCount })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        <AnimatePresence mode="wait">
        
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full grid md:grid-cols-[1.1fr_1fr] bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
          >
            <div className="aspect-[3/4] md:aspect-auto bg-primary/10 relative overflow-hidden min-h-[350px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="size-16 animate-spin text-primary mb-4" />
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center text-left">
              <h2 className="font-display text-3xl font-bold leading-tight text-primary mb-4">{t('vocab.opening')}</h2>
              <p className="text-muted-foreground text-sm">{t('vocab.gathering')}</p>
            </div>
          </motion.div>
        ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-card border border-border p-1.5 rounded-2xl flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab("bank")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "bank"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-4" />
              {t('vocab.wordBank')} ({allVocabWords.length})
            </button>

            <button
              onClick={() => setActiveTab("flashcards")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "flashcards"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="size-4" />
              {t('vocab.flashcards')}
            </button>

            <button
              onClick={() => setActiveTab("badges")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "badges"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="size-4" />
              {t('vocab.badges')} ({badges.filter(b => b.unlocked).length}/{badges.length})
            </button>
          </div>
        </div>

        {/* TAB 1: WORD BANK */}
        {activeTab === "bank" && (
          <div>
            {allVocabWords.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {allVocabWords.map((item, idx) => {
                  const isMastered = masteredWords.includes(item.word.toLowerCase());
                  return (
                    <Card key={idx} className="bg-card border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                      {isMastered && (
                        <div className="absolute top-3 right-3 text-emerald-500">
                          <CheckCircle2 className="size-5 fill-emerald-100" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-xl font-bold text-primary capitalize">
                            {item.word}
                          </h3>
                          <button
                            onClick={() => speakWord(item.word)}
                            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors"
                            title="Listen to word"
                          >
                            <Volume2 className="size-4" />
                          </button>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          "{item.meaning}"
                        </p>

                        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                          <span>From: <strong className="text-primary font-semibold">{item.storyTitle}</strong></span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 max-w-md mx-auto shadow-soft">
                <img src={mascot} alt="Mascot" className="size-20 mx-auto mb-4 animate-float" />
                <h3 className="font-display text-xl font-bold text-primary mb-2">{t('vocab.noWordsTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {t('vocab.noWordsDesc')}
                </p>
                <Button variant="hero" onClick={() => navigate({ to: "/" })}>
                  {t('vocab.exploreStories')}
                </Button>
                <style>{`
                  @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                  }
                  .animate-float {
                    animation: float 4s ease-in-out infinite;
                  }
                `}</style>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FLASHCARDS PRACTICE */}
        {activeTab === "flashcards" && (
          <div className="max-w-xl mx-auto text-center">
            {allVocabWords.length > 0 ? (
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-4">
                  Card {currentCardIndex + 1} of {allVocabWords.length} · Tap card to flip
                </p>

                {/* 3D Flip Card */}
                {(() => {
                  const currentCard = allVocabWords[currentCardIndex];
                  if (!currentCard) return null;
                  return (
                    <div 
                      className="perspective-1000 w-full aspect-[4/3] cursor-pointer my-6 select-none"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <motion.div 
                        className="relative w-full h-full rounded-4xl border border-border shadow-lift bg-card flex flex-col items-center justify-center p-8 text-center"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* FRONT SIDE */}
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden bg-card rounded-4xl"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <span className="text-xs uppercase tracking-widest font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                            Vocabulary Flashcard
                          </span>
                          <h2 className="font-display text-4xl font-extrabold text-foreground capitalize mb-4 drop-shadow-sm">
                            {currentCard.word}
                          </h2>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(currentCard.word);
                            }}
                            className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors border border-primary/20"
                          >
                            <Volume2 className="size-4" /> Listen to word
                          </button>
                          <p className="text-xs text-muted-foreground mt-8 animate-pulse">
                            Tap anywhere to reveal definition 🔄
                          </p>
                        </div>

                        {/* BACK SIDE */}
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground rounded-4xl backface-hidden shadow-lift border border-border"
                          style={{ 
                            backfaceVisibility: "hidden", 
                            transform: "rotateY(180deg)" 
                          }}
                        >
                          <span className="text-xs uppercase tracking-widest font-bold text-primary-foreground/80 mb-2">
                            Definition
                          </span>
                          <h3 className="font-display text-3xl font-bold text-primary-foreground capitalize mb-4 drop-shadow-sm">
                            {currentCard.word}
                          </h3>
                          <p className="text-lg text-primary-foreground/90 italic leading-relaxed max-w-md">
                            "{currentCard.meaning}"
                          </p>
                          <p className="text-sm text-primary-foreground/80 mt-6">
                            From story: <strong className="text-primary-foreground font-bold">{currentCard.storyTitle}</strong>
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })()}

                {/* Card Controls */}
                <div className="flex gap-4 justify-center mt-6">
                  <Button 
                    variant="soft" 
                    className="flex-1 font-bold py-6 text-lg"
                    onClick={() => handleNextCard()}
                  >
                    {t('vocab.needPractice')}
                  </Button>
                  <Button 
                    variant="hero"
                    className="flex-1 font-bold py-6 shadow-xl text-lg border-none"
                    onClick={() => handleNextCard(allVocabWords[currentCardIndex]?.word)}
                  >
                    {t('vocab.gotIt')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-muted-foreground">
                No words available for practice yet. Read stories to unlock flashcards!
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BADGES & ACHIEVEMENTS */}
        {activeTab === "badges" && (
          <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {badges.map((badge, idx) => (
                <Card 
                  key={idx}
                  className={`border-border text-center p-6 transition-all shadow-sm ${
                    badge.unlocked 
                      ? "bg-card border-primary/50" 
                      : "bg-muted/50 opacity-70 grayscale"
                  }`}
                >
                  <div className="text-5xl mb-3 select-none">{badge.icon}</div>
                  <h4 className={`font-display text-lg font-bold mb-1 ${badge.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {badge.desc}
                  </p>
                  <div className="mt-4">
                    {badge.unlocked ? (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 px-3 py-1 rounded-full border border-emerald-500/30">
                        {t('vocab.unlocked')}
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border">
                        {t('vocab.locked')}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
