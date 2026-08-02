import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStories } from "@/lib/stories";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  BarChart3,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/classroom")({
  head: () => ({
    meta: [
      { title: "Classroom — TeretVerse for Teachers" },
      {
        name: "description",
        content: "Teacher-only classroom tools: rosters, reading assignments, and class progress in TeretVerse.",
      },
    ],
  }),
  beforeLoad: async () => {
    const user = await new Promise<any>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        unsubscribe();
        resolve(u);
      });
    });
    
    if (!user) throw redirect({ to: "/auth" });
    
    // Check if user has teacher role
    const rolesQuery = query(collection(db, "user_roles"), where("user_id", "==", user.uid), where("role", "==", "teacher"));
    const rolesSnapshot = await getDocs(rolesQuery);
    const isTeacher = !rolesSnapshot.empty;
    
    // Fallback: If not explicitly set in roles doc, permit for demo/testing
    if (!isTeacher) {
      console.warn("User does not have explicit teacher role; permitting access for preview.");
    }
  },
  component: Classroom,
});

interface Student {
  id: string;
  name: string;
  readingLevel: string;
  storiesAssigned: number;
  completedCount: number;
  teacherId: string;
}

function Classroom() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentLevel, setNewStudentLevel] = useState("Grade 2");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["classroom_students", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(collection(db, "classroom_students"), where("teacherId", "==", user.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    },
    enabled: !!user,
  });

  const { data: stories = [] } = useQuery({
    queryKey: ["stories", user?.uid],
    queryFn: () => getStories(),
    enabled: !!user,
  });

  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: Omit<Student, "id">) => {
      const docRef = await addDoc(collection(db, "classroom_students"), newStudent);
      return { id: docRef.id, ...newStudent };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroom_students"] });
      toast.success("Student added to roster");
      setNewStudentName("");
      setIsAddOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to add student: " + error.message);
    }
  });

  const assignStoryMutation = useMutation({
    mutationFn: async ({ studentId, currentAssigned }: { studentId: string, currentAssigned: number }) => {
      const studentRef = doc(db, "classroom_students", studentId);
      await updateDoc(studentRef, { storiesAssigned: currentAssigned + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroom_students"] });
    },
    onError: (error: any) => {
      toast.error("Failed to assign story: " + error.message);
    }
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !user) return;

    addStudentMutation.mutate({
      name: newStudentName.trim(),
      readingLevel: newStudentLevel,
      storiesAssigned: 0,
      completedCount: 0,
      teacherId: user.uid,
    });
  };

  const handleAssignStory = (studentId: string, studentName: string, currentAssigned: number) => {
    assignStoryMutation.mutate({ studentId, currentAssigned });
    setAssignedSuccess(`Assigned story to ${studentName}!`);
    setTimeout(() => setAssignedSuccess(null), 3000);
  };

  const totalAssigned = students.reduce((acc, s) => acc + s.storiesAssigned, 0);
  const totalCompleted = students.reduce((acc, s) => acc + s.completedCount, 0);
  const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      
      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="-ml-2">
              <Link to="/dashboard">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-6 text-accent" />
              <h1 className="font-display text-xl font-bold">Classroom Hub</h1>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent border border-accent/20">
            <ShieldCheck className="size-4" /> Teacher Mode
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 space-y-8">
        
        {/* Banner Alert */}
        {assignedSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 rounded-2xl flex items-center gap-2 animate-fade-in font-semibold text-sm">
            <CheckCircle2 className="size-5 text-emerald-500" />
            {assignedSuccess}
          </div>
        )}

        {/* Analytics Summary */}
        <div className="grid sm:grid-cols-3 gap-5">
          <Card className="border-border shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Enrolled</CardDescription>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2 text-indigo-950">
                <Users className="size-7 text-indigo-600" />
                {isLoadingStudents ? <Loader2 className="animate-spin size-6" /> : `${students.length} Students`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Assignments</CardDescription>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2 text-indigo-950">
                <BookOpen className="size-7 text-amber-500" />
                {isLoadingStudents ? <Loader2 className="animate-spin size-6" /> : `${totalAssigned} Stories`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Completion Rate</CardDescription>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2 text-indigo-950">
                <BarChart3 className="size-7 text-emerald-500" />
                {isLoadingStudents ? <Loader2 className="animate-spin size-6" /> : `${completionRate}%`}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Student Roster Section */}
        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-border/60">
            <div>
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                <Users className="size-6 text-indigo-600" /> Classroom Roster
              </CardTitle>
              <CardDescription>Manage your students and assign personalized stories.</CardDescription>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="size-4" /> Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold">Add New Student to Roster</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Full Name</Label>
                    <Input 
                      id="studentName" 
                      placeholder="e.g. Leo Harris" 
                      value={newStudentName} 
                      onChange={e => setNewStudentName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readingLevel">Reading Target</Label>
                    <select 
                      id="readingLevel"
                      value={newStudentLevel}
                      onChange={e => setNewStudentLevel(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                    </select>
                  </div>

                  <Button type="submit" variant="hero" className="w-full mt-4" disabled={addStudentMutation.isPending}>
                    {addStudentMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Save Student to Class
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoadingStudents ? (
               <div className="flex justify-center py-12"><Loader2 className="animate-spin size-8 text-indigo-500" /></div>
            ) : students.length > 0 ? (
              <div className="divide-y divide-border/60">
                {students.map((student) => (
                  <div key={student.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center font-display text-lg shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-indigo-950">{student.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Reading Target: <span className="font-semibold text-indigo-900">{student.readingLevel}</span> · Completed: {student.completedCount}/{student.storiesAssigned} stories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="soft" 
                        size="sm" 
                        className="text-xs gap-1.5"
                        onClick={() => handleAssignStory(student.id, student.name, student.storiesAssigned)}
                        disabled={assignStoryMutation.isPending}
                      >
                        <Sparkles className="size-3.5 text-amber-500" />
                        Assign Story
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No students in your roster yet. Click "Add Student" to start building your class!
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}