import { mockAiProvider } from "@/lib/ai/mock-provider";
import { openAiProvider } from "@/lib/ai/openai-provider";

export function getAiProvider() {
  if (process.env.OPENAI_API_KEY) {
    return openAiProvider;
  }
  return mockAiProvider;
}
