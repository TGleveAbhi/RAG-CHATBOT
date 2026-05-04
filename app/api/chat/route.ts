import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { searchDocuments } from "@/lib/search";

export const dynamic = "force-dynamic";

const FREE_MODELS = [
  "openrouter/auto",
  "meta-llama/llama-3-8b-instruct",
  "mistralai/mistral-small",
];

type ChatRequestMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatRequestMessage[];
};

type SearchResult = Awaited<ReturnType<typeof searchDocuments>>[number];

const isRetryableModelError = (
  error: unknown
): error is { status: 429 | 404 | 503 } =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  (error.status === 429 || error.status === 404 || error.status === 503);

export async function POST(req: Request) {
  try {
    // ✅ Client moved inside handler
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const { messages = [] } = (await req.json()) as ChatRequestBody;
    const lastMessage = messages[messages.length - 1]?.content || "";

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const shouldSearch = true;

    let results: SearchResult[] = [];
    const searchQuery = lastMessage + " personal details name";

    if (shouldSearch) {
      try {
        results = await searchDocuments(searchQuery, 8);
      } catch (err) {
        console.warn("Search failed, proceeding without context:", err);
      }
    }

    // Build context
    const context =
      results.length > 0
        ? results.map((r, i) => `[${i + 1}] ${r.content}`).join("\n\n")
        : "No relevant information found.";

    // System prompt
    const systemPrompt = `You are a helpful assistant.

STRICT RULES:
- Answer ONLY using the provided context
- Do NOT use your own knowledge
- If answer is not in context, say "I don't know"

Context:
${context}`;

    let lastError: unknown = null;
    const completionMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Try models one by one
    for (const model of FREE_MODELS) {
      try {
        console.log("Trying model:", model);

        const response = await client.chat.completions.create({
          model,
          messages: completionMessages,
        });

        const answer = response.choices[0]?.message?.content || "No response";

        console.log(`Responded using: ${model}`);

        return Response.json({ message: answer });
      } catch (err) {
        if (isRetryableModelError(err)) {
          console.warn(`${model} failed (${err.status}), trying next...`);
          lastError = err;
          await sleep(1000);
          continue;
        }

        // Unknown error → stop immediately
        throw err;
      }
    }

    // All models failed
    console.error("All models failed:", lastError);

    return Response.json(
      {
        message:
          "All models are busy or unavailable. Please try again in a moment.",
      },
      { status: 429 }
    );
  } catch (error) {
    console.error("Server error:", error);

    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}