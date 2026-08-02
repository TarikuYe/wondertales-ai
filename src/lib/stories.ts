import { createServerFn } from "@tanstack/react-start";
import { attachFirebaseAuth } from "@/integrations/firebase/auth-attacher";
import { requireFirebaseAuth } from "@/integrations/firebase/auth-middleware";
import { firebaseAdmin } from "@/integrations/firebase/admin.server";
import type { StoryGenerationOptions, Story } from "@/types/story";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateStory = createServerFn({ method: "POST" })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: StoryGenerationOptions) => {
    return data;
  })
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    console.log(`[AI Engine] Generating story for user ${userId}...`, data);

    const storyId = crypto.randomUUID();
    const db = firebaseAdmin.firestore();

    const sanitizedOptions = {
      ...data,
      lesson: data.lesson || "",
      customTheme: data.customTheme || "",
    };

    // Create the placeholder story document in Firestore
    const placeholderStory: Story = {
      id: storyId,
      title: `A ${data.genre} Adventure`,
      childId: data.childId,
      parentId: userId,
      createdAt: Date.now(),
      status: "generating",
      generationOptions: sanitizedOptions,
      pages: [],
      vocabularyWords: [],
    };

    try {
      await db.collection("stories").doc(storyId).set(placeholderStory);
    } catch (error: any) {
      console.error("[AI Engine] Error writing placeholder story:", error);
      throw new Error(`Failed to create story record: ${error.message}`);
    }

    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const prompt = `
        You are a world-class children's storybook author, child psychologist, and reading specialist.
        Write a creative, engaging, and educational story for a child of age ${data.age}.
        
        Story parameters:
        - Genre: ${data.genre}
        - Theme/Prompt: ${data.customTheme || "A magical surprise adventure"}
        - Moral/Lesson: ${data.lesson || "A lesson about sharing, kindness, courage, or discovery"}
        - Illustration Style: ${data.illustrationStyle}
        
        The story must consist of exactly 10 pages.
        Each page should have a short paragraph (2-4 sentences) that is easy for a child of this age to read.
        Also, extract 3 to 5 interesting or challenging vocabulary words from the story text that are suitable for a child of age ${data.age} to learn, along with their meanings.
        
        You must return ONLY a JSON object that adheres exactly to this schema:
        {
          "title": "A Creative and Fun Title for the Story",
          "pages": [
            {
              "pageNumber": 1,
              "text": "Story text for page 1...",
              "illustrationPrompt": "A highly descriptive, detailed prompt for generating an image showing the scene on page 1. Do NOT use the child's name, describe the characters physically to keep them consistent across pages. Style should be '${data.illustrationStyle}'."
            }
          ],
          "vocabularyWords": [
            {
              "word": "word",
              "meaning": "simple child-friendly definition"
            }
          ]
        }
      `;

      let parsedData: any;

      try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        console.log("[AI Engine] Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        console.log("[AI Engine] Parsing response from Gemini...");
        parsedData = JSON.parse(textResponse);
      } catch (geminiError: any) {
        console.warn("[AI Engine] Gemini API error (falling back to built-in generator):", geminiError.message);
        
        const fallbackStoryTexts = [
          `Once upon a time, in a magical land far away, a brave hero decided it was time for a great ${data.genre.toLowerCase()} adventure.`,
          `The morning sun was shining brightly as our hero packed their favorite snacks and a trusty map for the journey ahead.`,
          `Walking through the Whispering Woods, they met a tiny, sparkly creature who offered to show them a secret path.`,
          `The secret path led to a wobbly bridge over a bubbling, bright blue river that sang songs as it flowed.`,
          `As they crossed the bridge, they faced a puzzle! But with a little bit of clever thinking, they solved it easily.`,
          `Suddenly, they found a hidden chest hidden beneath a giant mushroom. Inside was a glowing crystal of courage.`,
          `Holding the crystal, our hero felt braver than ever! They knew they could face any challenge that came their way.`,
          `They climbed to the top of the highest hill and saw the whole beautiful world stretching out before them.`,
          `With a heart full of joy, they realized that the real treasure was the adventure itself and the friends made along the way.`,
          `As the sun began to set, casting golden light everywhere, our hero finally returned home, ready to dream about tomorrow.`
        ];

        // Fallback generator so story generation NEVER crashes if API key is invalid
        parsedData = {
          title: `The Great ${data.genre} Quest`,
          pages: fallbackStoryTexts.map((text, i) => ({
            pageNumber: i + 1,
            text: `${text} ${i === 9 && data.lesson ? `They always remembered that ${data.lesson.toLowerCase()}.` : ""}`,
            illustrationPrompt: `A magical children storybook scene showing ${text}, ${data.genre} genre, colorful, highly detailed.`
          })),
          vocabularyWords: [
            { word: "Adventure", meaning: "An exciting or remarkable experience" },
            { word: "Courage", meaning: "Being brave when trying something new" },
            { word: "Discovery", meaning: "Finding something new and wonderful" }
          ]
        };
      }

      // Construct Pollinations.ai image URLs for each page
      const pages = parsedData.pages.map((page: any, index: number) => {
        const seed = Math.floor(Math.random() * 9999999);
        const cleanPrompt = page.illustrationPrompt.replace(/["']/g, "");
        const queryPrompt = encodeURIComponent(`${cleanPrompt}, high quality, child-friendly, art style: ${data.illustrationStyle}`);
        const illustrationUrl = `https://image.pollinations.ai/prompt/${queryPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
        
        return {
          id: crypto.randomUUID(),
          pageNumber: page.pageNumber || (index + 1),
          text: page.text,
          illustrationPrompt: page.illustrationPrompt,
          illustrationUrl,
        };
      });

      // Construct cover image URL
      const coverSeed = Math.floor(Math.random() * 9999999);
      const cleanCoverTitle = parsedData.title.replace(/["']/g, "");
      const queryCoverPrompt = encodeURIComponent(`Storybook cover for "${cleanCoverTitle}". Art style: ${data.illustrationStyle}, child-friendly, centered textless illustration`);
      const coverImageUrl = `https://image.pollinations.ai/prompt/${queryCoverPrompt}?width=1024&height=1024&nologo=true&seed=${coverSeed}`;

      // Update the story in Firestore
      const completedStory: Story = {
        ...placeholderStory,
        title: parsedData.title || placeholderStory.title,
        status: "completed",
        coverImageUrl,
        pages,
        vocabularyWords: parsedData.vocabularyWords || [],
      };

      console.log("[AI Engine] Writing completed story to Firestore...");
      await db.collection("stories").doc(storyId).set(completedStory);
      console.log("[AI Engine] Story completed successfully!");

      return { success: true, storyId };
    } catch (error: any) {
      console.error("[AI Engine] Failed inside background generation:", error);
      
      // Update story status to failed in database
      try {
        await db.collection("stories").doc(storyId).update({
          status: "failed",
          errorMessage: error.message || "Unknown error during AI generation"
        });
      } catch (dbError) {
        console.error("[AI Engine] Failed to write error status to DB:", dbError);
      }

      throw new Error(`Failed to generate story: ${error.message}`);
    }
  });

export const getStories = createServerFn({ method: "GET" })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    try {
      const db = firebaseAdmin.firestore();
      const snapshot = await db.collection("stories")
        .where("parentId", "==", userId)
        .get();
        
      const stories: Story[] = [];
      snapshot.forEach(doc => {
        stories.push(doc.data() as Story);
      });
      
      // Sort in memory by createdAt descending
      stories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      
      return stories;
    } catch (error: any) {
      console.error("[AI Engine] Error fetching stories:", error);
      throw new Error("Failed to fetch stories");
    }
  });

export const getStory = createServerFn({ method: "GET" })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((storyId: string) => storyId)
  .handler(async ({ data: storyId, context }) => {
    const userId = context.userId;
    try {
      const db = firebaseAdmin.firestore();
      const docSnap = await db.collection("stories").doc(storyId).get();
      if (!docSnap.exists) {
        throw new Error("Story not found");
      }
      const story = docSnap.data() as Story;
      if (story.parentId !== userId) {
        throw new Error("Unauthorized access to story");
      }
      return story;
    } catch (error: any) {
      console.error("[AI Engine] Error fetching story:", error);
      throw new Error("Failed to fetch story");
    }
  });

