const EMBEDDING_MODEL = "openai/text-embedding-3-small";

async function fetchEmbeddings(inputs: string[]): Promise<number[][]> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: inputs,
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replaceAll("\n", " ");
  const results = await fetchEmbeddings([input]);
  return results[0];
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const inputs = texts.map((t) => t.replaceAll("\n", " "));
  return await fetchEmbeddings(inputs);
}