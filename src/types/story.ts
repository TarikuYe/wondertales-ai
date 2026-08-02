export type StoryGenre =
  | "Bedtime"
  | "Adventure"
  | "Animals"
  | "Fantasy"
  | "Space"
  | "Ocean"
  | "Dinosaurs"
  | "World Folktales"
  | "STEM"
  | "Kindness"
  | "Big Feelings"
  | "Friendship"
  | "Healthy Habits";

export type IllustrationStyle =
  | "Storybook"
  | "Watercolor"
  | "Soft Cartoon"
  | "Paper Cut"
  | "3D Cartoon"
  | "Fantasy"
  | "Animal World"
  | "Nature";

export type VoiceType =
  | "Grandmother"
  | "Friendly Dad"
  | "Young Girl"
  | "Wizard"
  | "Pirate"
  | "Robot"
  | "Custom";

export interface StoryGenerationOptions {
  childId: string;
  age: number;
  length: "Short (10-15 pages)" | "Medium (20-30 pages)" | "Long (30-40 pages)";
  genre: StoryGenre;
  lesson?: string; // Optional moral or lesson (e.g., "Sharing is caring")
  customTheme?: string; // e.g., "A magical forest"
  illustrationStyle: IllustrationStyle;
  voice: VoiceType;
}

export interface StoryPage {
  id: string; // page number or uuid
  pageNumber: number;
  text: string;
  illustrationUrl?: string;
  illustrationPrompt?: string; // What we asked the AI to draw
  audioUrl?: string; // For narration
}

export interface Story {
  id: string;
  title: string;
  childId: string;
  parentId: string;
  createdAt: number;
  status: "generating" | "completed" | "failed";
  generationOptions: StoryGenerationOptions;
  coverImageUrl?: string;
  pages: StoryPage[]; // In Firestore, this could be a subcollection if huge, or just an array
  vocabularyWords: { word: string; meaning: string }[];
}
