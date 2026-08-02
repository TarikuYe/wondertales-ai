import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getChildren } from '@/lib/children';
import { getStories } from '@/lib/stories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, LogOut, Loader2, Star, ShieldAlert } from 'lucide-react';
import mascot from '@/assets/mascot-wisp.png';
import { useSession } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

interface KidsLibraryProps {
  activeChildId: string;
}

export function KidsLibrary({ activeChildId }: KidsLibraryProps) {
  const navigate = useNavigate();
  const { user } = useSession();
  const { t } = useTranslation();
  const [showParentGate, setShowParentGate] = useState(false);
  const [gateQuestion, setGateQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);

  // Fetch children to find active child
  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ['children', user?.uid],
    queryFn: () => getChildren(),
    enabled: !!user,
  });

  const activeChild = children.find((c: any) => c.id === activeChildId);

  // Fetch stories
  const { data: stories = [], isLoading: isLoadingStories } = useQuery({
    queryKey: ['stories', user?.uid],
    queryFn: () => getStories(),
    enabled: !!user,
  });

  // Filter stories for this child (or show unassigned stories)
  const childStories = stories.filter((story: any) => {
    if (!story.childId) return true;
    return story.childId === activeChildId;
  });

  const startParentGate = () => {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    setGateQuestion({ num1, num2, answer: num1 * num2 });
    setGateInput('');
    setGateError(false);
    setShowParentGate(true);
  };

  const handleVerifyParentGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateInput) === gateQuestion.answer) {
      localStorage.removeItem('activeChildId');
      setShowParentGate(false);
      navigate({ to: '/select-profile' });
    } else {
      setGateError(true);
      setGateInput('');
    }
  };

  if (isLoadingChildren || isLoadingStories) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <Loader2 className="animate-spin size-10 text-indigo-600 mb-3" />
        <p className="font-display text-lg text-muted-foreground">Opening your magical library...</p>
      </div>
    );
  }

  const childName = activeChild?.name || 'Little Hero';
  const childAvatar = activeChild?.avatar || '🐣';
  const favoriteColor = activeChild?.favoriteColor || '#e9d5ff'; // default soft purple

  return (
    <div 
      className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans pb-20"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, ${favoriteColor}08, transparent 60%)`
      }}
    >
      {/* Main Header - Keep dark for a premium dashboard contrast */}
      <header className="sticky top-0 z-40 bg-indigo-950 border-b border-indigo-900 px-6 py-4 text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-md select-none">{childAvatar}</span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-wide text-amber-300">
                {t('dashboard.welcomeBack', { name: childName })}
              </h1>
              <p className="text-xs text-indigo-200">{t('dashboard.readyForAdventure')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              className="text-xs hover:bg-white/10 text-indigo-200 hover:text-white gap-2"
              onClick={() => navigate({ to: '/vocabulary' })}
            >
              <Sparkles className="size-4 text-amber-300" />
              {t('nav.vocabVault')}
            </Button>

            <Button
              variant="ghost"
              className="text-xs hover:bg-white/10 text-indigo-200 hover:text-white gap-2"
              onClick={startParentGate}
            >
              <LogOut className="size-4" />
              {t('nav.switchProfile')}
            </Button>
          </div>
        </div>
      </header>

      {/* Library Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        
        {/* Streak / Motivation Card */}
        <div className="mb-10 bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl border border-amber-200 text-amber-600">
              <Star className="size-8 fill-amber-500 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-indigo-950">{t('dashboard.bedtimeRoutine')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.streakMsg')} 🔥 {t('dashboard.days', { count: 3 })}</p>
            </div>
          </div>
          <Button 
            variant="hero" 
            className="w-full md:w-auto gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-indigo-950 font-bold"
            onClick={() => navigate({ to: '/create-story' })}
          >
            <Sparkles className="size-5 fill-indigo-950" />
            {t('dashboard.createNewStory')}
          </Button>
        </div>

        {/* Bookshelf Section */}
        <div className="relative">
          <h2 className="font-display text-2xl font-bold mb-6 text-indigo-950 flex items-center gap-2">
            <BookOpen className="size-6 text-indigo-900" />
            {t('dashboard.yourBookshelf')}
          </h2>

          {childStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-20">
              {childStories.map((story: any) => (
                <div 
                  key={story.id}
                  className="group relative cursor-pointer"
                  onClick={() => navigate({ to: `/story/${story.id}` as any })}
                >
                  {/* Book Mockup wrapper */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md border border-border transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-lg">
                    
                    {/* Spine gradient overlay */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent z-20" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-950 flex flex-col justify-between p-4 text-center">
                      {story.coverImageUrl ? (
                        <img 
                          src={story.coverImageUrl} 
                          alt={story.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-indigo-950 to-purple-950 opacity-90" />
                      )}
                      
                      {/* Vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />

                      {/* Header elements inside cover */}
                      <div className="relative z-20 text-right">
                        <span className="inline-block text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-full shadow-sm">
                          {story.generationOptions?.genre || 'Story'}
                        </span>
                      </div>

                      {/* Title and stats inside cover */}
                      <div className="relative z-20 text-left mt-auto">
                        <h4 className="font-display font-bold text-sm leading-snug text-white line-clamp-2 drop-shadow-md group-hover:text-amber-200 transition-colors">
                          {story.title}
                        </h4>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-[10px] text-indigo-200/90 font-medium">
                            {story.status === 'generating' ? 'Writing...' : t('dashboard.tapToRead')}
                          </p>
                          {story.status === 'generating' && (
                            <Loader2 className="animate-spin size-3 text-amber-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wood Shelf Shadow effect beneath the grid row */}
                  <div className="absolute -bottom-2 left-1 right-1 h-2 bg-black/10 blur-[2px] rounded-full group-hover:opacity-40 transition-opacity" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-3xl px-6 shadow-soft">
              <img src={mascot} alt="Mascot Wisp" className="size-20 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-indigo-950 mb-2">Your Bookshelf is Ready!</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm mb-6 leading-relaxed">
                Ask your parent to create a brand new bedtime adventure story for you. It will magically appear right here on your shelf!
              </p>
              <Button 
                variant="soft" 
                className="gap-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-900 font-bold"
                onClick={() => navigate({ to: '/create-story' })}
              >
                <Sparkles className="size-4 text-indigo-900" />
                Create Story
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Parent Gate Modal */}
      {showParentGate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-lift relative text-foreground">
            <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShieldAlert className="size-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-indigo-950 mb-2">Parents Area</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Solve this math puzzle to prove you are a parent:
            </p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl py-4 px-6 mb-6 font-display text-2xl font-bold tracking-widest text-indigo-900 select-none">
              {gateQuestion.num1} &times; {gateQuestion.num2} = ?
            </div>

            <form onSubmit={handleVerifyParentGate} className="space-y-4">
              <input
                type="number"
                pattern="\d*"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="Enter answer"
                className="w-full bg-background border border-border focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-center text-xl font-bold outline-none"
                autoFocus
              />

              {gateError && (
                <p className="text-xs font-semibold text-rose-500">
                  That answer isn't correct. Try again!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={() => setShowParentGate(false)}
                >
                  Go Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 font-bold hover:from-amber-300 hover:to-orange-400"
                >
                  Verify
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
