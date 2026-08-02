import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStory } from "@/lib/stories";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Loader2, 
  Trophy, 
  HelpCircle,
  CheckCircle2,
  XCircle,
  HelpCircle as HelpIcon,
  Sparkles
} from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_authenticated/story/$storyId")({
  component: StoryReader,
});

function StoryReader() {
  const { storyId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  
  // Page Navigation State (-1 is Cover Page, pages.length is end page)
  const [pageIndex, setPageIndex] = useState(-1);
  
  // TTS (Text-to-Speech) State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9); // Default slow for kids
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isAutoPlayingRef = useRef(false);

  // Vocabulary Popover State
  const [activeVocab, setActiveVocab] = useState<{ word: string; meaning: string } | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveWordIndex(null);
  };

  // Fetch story details
  const { data: story, isLoading, error } = useQuery({
    queryKey: ["story", storyId, user?.uid],
    queryFn: () => getStory({ data: storyId }),
    enabled: !!user,
    refetchInterval: (query) => {
      // Poll every 3 seconds if story is still generating
      return query.state.data?.status === "generating" ? 3000 : false;
    },
  });

  // Stop reading when page changes and auto-play next page if active
  useEffect(() => {
    stopReading();
    if (isAutoPlayingRef.current && pageIndex >= 0 && story?.pages && pageIndex < story.pages.length) {
      const timer = setTimeout(() => {
        startReading();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pageIndex, story?.pages]);

  // Cleanup synthesis on unmount
  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  const pages = story?.pages || [];
  const currentStoryPage = pageIndex >= 0 && pageIndex < pages.length ? pages[pageIndex] : null;

  // Text highlighting parsing
  const renderInteractiveText = (text: string) => {
    const words = text.split(/\s+/);
    
    return words.map((word, idx) => {
      // Clean word for matching vocab lists (remove punctuation)
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase();
      const isVocab = story?.vocabularyWords?.some((v: any) => v.word.toLowerCase() === cleanWord);
      
      const isHighlighted = idx === activeWordIndex;
      
      return (
            <span 
          key={idx}
          className={`inline-block mr-1.5 cursor-pointer rounded transition-all duration-150 py-0.5 ${
            isHighlighted 
              ? "bg-primary text-primary-foreground font-bold px-1 scale-105 shadow-md shadow-primary/20" 
              : isVocab 
                ? "text-primary underline decoration-dotted decoration-primary decoration-2 hover:bg-primary/10 px-0.5 font-medium" 
                : "text-foreground hover:bg-muted px-0.5"
          }`}
          onClick={() => {
            if (isVocab) {
              const vocabItem = story?.vocabularyWords?.find((v: any) => v.word.toLowerCase() === cleanWord);
              if (vocabItem) setActiveVocab(vocabItem);
            }
          }}
        >
          {word}
        </span>
      );
    });
  };

  // TTS playback engine
  const startReading = () => {
    if (!currentStoryPage) return;
    
    stopReading();

    const ttsText = currentStoryPage.text;
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utteranceRef.current = utterance;
    
    utterance.rate = speechRate;
    utterance.lang = "en-US"; // Fallback, could check child preferences later

    // Split text to handle word index mapping on boundaries
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        const textBefore = ttsText.slice(0, charIndex).trim();
        const wordCount = textBefore === "" ? 0 : textBefore.split(/\s+/).length;
        setActiveWordIndex(wordCount);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWordIndex(null);
      if (isAutoPlayingRef.current) {
        setPageIndex(prev => {
          if (prev < pages.length - 1) {
            return prev + 1;
          } else {
            isAutoPlayingRef.current = false;
            return prev;
          }
        });
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWordIndex(null);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };



  const togglePlayback = () => {
    if (isPlaying) {
      stopReading();
      isAutoPlayingRef.current = false;
    } else {
      isAutoPlayingRef.current = true;
      startReading();
    }
  };

  // Mock quiz options generated based on story info
  const quizQuestions = story ? [
    {
      q: `What was the primary setting of "${story.title}"?`,
      options: [
        story.generationOptions?.genre === "Space" ? "A futuristic spaceship" : "A magical fantasy forest",
        "A regular sandy beach",
        "Under the kitchen sink",
        "A bustling city market"
      ],
      correct: 0
    },
    {
      q: "Which word best describes how the story ended?",
      options: [
        "Silly and unexpected",
        "Happy and friendly",
        "Scary and loud",
        "Quiet and sleepy"
      ],
      correct: 1
    },
    {
      q: "What was the main lesson or value highlighted in this adventure?",
      options: [
        story.generationOptions?.lesson || "Always be kind and share with friends",
        "How to count to one hundred",
        "Dinosaurs are very large animals",
        "Why you should eat vegetables"
      ],
      correct: 0
    }
  ] : [];

  const handleQuizAnswer = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary)_0.05,transparent_50%)] pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--color-primary)_0.05,transparent_50%)] pointer-events-none opacity-20" />
      
      {/* Top Navbar */}
      <header className="bg-indigo-950 border-b border-indigo-900 px-6 py-4 flex items-center justify-between z-40 text-white">
        <Button 
          variant="ghost" 
          className="text-xs hover:bg-white/10 text-indigo-200 hover:text-white gap-2"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="size-4" />
          Back to Shelf
        </Button>
        <span className="font-display font-bold text-sm text-indigo-300 drop-shadow-sm select-none">
          {story?.title || (isLoading ? "Loading..." : "Storybook")}
        </span>
        <div className="w-24 text-right text-xs text-indigo-300 font-semibold">
          {isLoading ? "Opening" : error || !story ? "Error" : story?.status === "generating" ? "Generating" : pageIndex === -1 ? "Cover" : pageIndex === pages.length ? "The End" : `Page ${pageIndex + 1} of ${pages.length}`}
        </div>
      </header>

      {/* Main Reading Window */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-10 z-10 relative">
        <AnimatePresence mode="wait">

          {/* LOADING STATE */}
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full grid md:grid-cols-[1.1fr_1fr] bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
            >
              <div className="aspect-[3/4] bg-primary/10 relative overflow-hidden min-h-[350px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-16 animate-spin text-primary" />
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center text-left">
                <h2 className="font-display text-3xl font-bold leading-tight text-primary mb-4">Opening storybook...</h2>
              </div>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {(!isLoading && (error || !story)) && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full grid md:grid-cols-[1.1fr_1fr] bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
            >
              <div className="aspect-[3/4] bg-primary/10 relative overflow-hidden min-h-[350px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <XCircle className="size-20 text-rose-500/50" />
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center text-left">
                <h2 className="font-display text-3xl font-bold leading-tight text-rose-400 mb-4">Oops! Couldn't open the book</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">Make sure you are logged in and this story belongs to your account.</p>
                <Button variant="hero" asChild><Link to="/">Back to Bookshelf</Link></Button>
              </div>
            </motion.div>
          )}

          {/* GENERATING STATE */}
          {(!isLoading && story?.status === "generating") && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full grid md:grid-cols-[1.1fr_1fr] bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
            >
              <div className="aspect-[3/4] bg-primary/10 relative overflow-hidden min-h-[350px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <style>{`
                    @keyframes float {
                      0%, 100% { transform: translateY(0px) rotate(0deg); }
                      50% { transform: translateY(-15px) rotate(5deg); }
                    }
                    .animate-float {
                      animation: float 4s ease-in-out infinite;
                    }
                  `}</style>
                  <img src={mascot} alt="Mascot" className="size-36 animate-float" />
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center text-left">
                <h2 className="font-display text-3xl font-bold leading-tight text-primary mb-4">Creating bedtime magic...</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">The AI engine is illustrating pages, creating narration options, and placing vocabulary words into this adventure. This usually takes 1 to 2 minutes.</p>
                
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border mb-2">
                  <div className="h-full bg-primary rounded-full animate-[loading-bar_15s_ease-out_infinite]" style={{ width: "60%" }} />
                </div>
                <p className="text-xs text-muted-foreground animate-pulse">Checking generation status... (refreshing automatically)</p>
                <style>{`
                  @keyframes loading-bar {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 95%; }
                  }
                `}</style>
              </div>
            </motion.div>
          )}

          {/* COVER PAGE VIEW */}
          {(!isLoading && story?.status === "completed" && pageIndex === -1) && (
            <motion.div 
              key="cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full grid md:grid-cols-[1.1fr_1fr] bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
            >
              <div className="aspect-[3/4] bg-primary/10 relative overflow-hidden min-h-[350px]">
                {story.coverImageUrl ? (
                  <img 
                    src={story.coverImageUrl} 
                    alt={story.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                    <BookOpen className="size-20 text-primary/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-between text-left">
                <div>
                  <span className="inline-block text-xs uppercase font-bold tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full mb-6">
                    {story.generationOptions?.genre}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-primary mb-4">
                    {story.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Join this magical custom adventure! Filled with colorful pages, audio narration, and fun vocabulary words to learn along the way.
                  </p>
                </div>
                
                <div className="mt-8 flex flex-col gap-3">
                  <Button 
                    variant="hero" 
                    size="xl" 
                    onClick={() => setPageIndex(0)}
                  >
                    Start Reading 🚀
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* INNER STORY PAGES */}
          {(!isLoading && story?.status === "completed" && currentStoryPage) && (
            <motion.div 
              key={`page-${pageIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="max-w-5xl w-full grid md:grid-cols-2 bg-card border border-border rounded-4xl overflow-hidden shadow-soft"
            >
              {/* Left Side: Page Illustration */}
              <div className="aspect-square md:aspect-auto bg-primary/10 relative overflow-hidden min-h-[300px]">
                {currentStoryPage.illustrationUrl ? (
                  <img 
                    src={currentStoryPage.illustrationUrl} 
                    alt={`Illustration for page ${pageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <Loader2 className="animate-spin size-8 text-primary mb-3" />
                    <p className="text-xs text-muted-foreground">The picture is arriving shortly...</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Right Side: Page Text */}
              <div className="p-8 md:p-12 flex flex-col justify-between text-left">
                <div className="flex-1 flex items-center">
                  <p className="font-display text-xl md:text-2xl leading-relaxed text-foreground font-medium tracking-wide">
                    {renderInteractiveText(currentStoryPage.text)}
                  </p>
                </div>

                {/* Page Action Bar (Audio controls) */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="soft"
                      size="icon"
                      className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 size-11"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause className="size-5 fill-primary" /> : <Play className="size-5 fill-primary" />}
                    </Button>
                    <span className="text-xs text-muted-foreground font-semibold select-none">
                      {isPlaying ? "Narration Playing" : "Tap to Listen"}
                    </span>
                  </div>

                  {/* Speech Rate Controller */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Speed:</span>
                    <button 
                      onClick={() => {
                        const nextRate = speechRate === 0.7 ? 0.9 : speechRate === 0.9 ? 1.1 : 0.7;
                        setSpeechRate(nextRate);
                        if (isPlaying) startReading(); // Restart with new speed
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground font-bold hover:bg-muted/80"
                    >
                      {speechRate === 0.7 ? "0.7x (Slower)" : speechRate === 0.9 ? "0.9x (Normal)" : "1.1x (Faster)"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* THE END PAGE / QUIZ VIEW */}
          {(!isLoading && story?.status === "completed" && pageIndex === pages.length) && (
            <motion.div 
              key="end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full bg-card border border-border rounded-4xl p-8 md:p-12 text-center shadow-soft relative"
            >
              {/* Confetti simulation when perfect score or completion */}
              <ConfettiEffect />

              <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <Trophy className="size-8" />
              </div>

              <h2 className="font-display text-3xl font-bold text-primary mb-2">The End!</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm mb-10">
                Incredible reading! You've successfully finished reading <strong>{story?.title}</strong>. Ready for a quick learning check?
              </p>

              {/* Quiz section */}
              <div className="max-w-2xl mx-auto text-left bg-muted/40 border border-border rounded-3xl p-6 md:p-8 mb-8">
                <h3 className="font-display text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <HelpCircle className="size-5 text-primary" />
                  Magical Comprehension Quiz
                </h3>

                <div className="space-y-6">
                  {quizQuestions.map((question, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-bold text-foreground">{qIdx + 1}. {question.q}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {question.options.map((option, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = question.correct === oIdx;
                          
                          let cardStyle = "bg-card border-border hover:bg-muted";
                          if (isSelected) {
                            if (quizSubmitted) {
                              cardStyle = isCorrect ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700" : "bg-rose-500/10 border-rose-500/40 text-rose-700";
                            } else {
                              cardStyle = "bg-primary/10 border-primary text-primary";
                            }
                          } else if (quizSubmitted && isCorrect) {
                            cardStyle = "bg-emerald-500/5 border-emerald-500/20 text-emerald-600";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizAnswer(qIdx, oIdx)}
                              className={`w-full text-left rounded-xl border p-3 text-xs font-semibold flex items-center justify-between transition-all outline-none ${cardStyle}`}
                            >
                              <span>{option}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="size-4 text-emerald-400 shrink-0 ml-2" />}
                              {quizSubmitted && isSelected && !isCorrect && <XCircle className="size-4 text-rose-400 shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  {quizSubmitted ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Your score:</span>
                        <span className="text-lg font-bold text-primary">{quizScore} / {quizQuestions.length}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-xs hover:bg-white/5 hover:text-white"
                        onClick={handleResetQuiz}
                      >
                        <RotateCcw className="size-4 mr-2" /> Try Again
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="hero"
                      className="ml-auto"
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                      onClick={handleSubmitQuiz}
                    >
                      Submit Answers
                    </Button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setPageIndex(-1)} // restart
                >
                  <RotateCcw className="size-4 mr-2" />
                  Read Story Again
                </Button>
                <Button 
                  variant="hero"
                  asChild
                >
                  <Link to="/">Back to Bookshelf 📚</Link>
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Interactive Vocabulary Modal */}
      <AnimatePresence>
        {activeVocab && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-4xl p-8 max-w-sm w-full text-center shadow-lift relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="bg-primary/10 text-primary w-24 h-24 rounded-full flex items-center justify-center border-4 border-card shadow-sm">
                  <Sparkles className="size-10" />
                </div>
              </div>

              <div className="pt-12 mb-6">
                <span className="text-xs uppercase tracking-widest font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
                  New Word
                </span>
                <h3 className="font-display text-4xl font-extrabold text-foreground capitalize mb-2">
                  {activeVocab.word}
                </h3>
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  "{activeVocab.meaning}"
                </p>
              </div>

                <Button 
                  variant="hero"
                  className="w-full mt-2"
                  onClick={() => setActiveVocab(null)}
                >
                  Awesome!
                </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Audio Bar if page contains audio playing */}
      {pageIndex >= 0 && pageIndex < pages.length && (
        <footer className="bg-indigo-950 border-t border-white/5 px-6 py-4 flex items-center justify-between z-40">
          <Button
            variant="ghost"
            disabled={pageIndex === -1}
            onClick={() => setPageIndex(p => p - 1)}
            className="text-xs hover:bg-white/5 hover:text-white text-indigo-200"
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous Page
          </Button>

          <Button
            variant="ghost"
            onClick={() => setPageIndex(p => p + 1)}
            className="text-xs hover:bg-white/5 hover:text-white text-indigo-200"
          >
            {pageIndex === pages.length - 1 ? "Complete Story" : "Next Page"}
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </footer>
      )}
    </div>
  );
}

// Inline Confetti effect using raw CSS animations
function ConfettiEffect() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; delay: number }[]>([]);
  
  useEffect(() => {
    const colors = ["#f43f5e", "#3b82f6", "#10b981", "#eab308", "#a855f7", "#ff7849"];
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -20 - 5,
      color: colors[Math.floor(Math.random() * colors.length)] || "#f43f5e",
      size: Math.random() * 8 + 6,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${Math.random() * 3 + 2.5}s`,
          }}
        />
      ))}
    </div>
  );
}
