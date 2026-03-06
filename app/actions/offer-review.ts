"use server";

import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";
import { getAiProvider } from "@/lib/ai";
import type { OfferReviewInput } from "@/lib/schemas/domain";
import { offerReviewInputSchema } from "@/lib/schemas/domain";

export async function generateOfferReviewAction(input: OfferReviewInput) {
  const parsed = offerReviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error" as const,
      message: "条件通知の入力内容を確認してください。",
      generatedAt: new Date().toISOString(),
    };
  }

  const result = await getAiProvider().generateOfferReview(parsed.data);

  return result.result
    ? {
        ...result,
        result: {
          ...result.result,
          disclaimer: OFFER_REVIEW_DISCLAIMER,
        },
      }
    : result;
}
