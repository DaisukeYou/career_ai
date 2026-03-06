import { z } from "zod";

export const appModeSchema = z.enum(["general", "construction"]);
export const generationStatusSchema = z.enum(["success", "refusal", "error"]);
export const toneOptionSchema = z.enum([
  "balanced",
  "confident",
  "formal",
  "friendly",
]);
export const confidenceSchema = z.enum(["high", "medium", "low"]);

export const worryOptionSchema = z.enum([
  "経験が浅くて不安",
  "書類に自信がない",
  "面接が苦手",
  "年収を上げたい",
  "働き方を見直したい",
  "建設業界で条件を整理したい",
]);

export const generationMetaSchema = z.object({
  status: generationStatusSchema,
  message: z.string(),
  refusalReason: z.string().optional(),
  generatedAt: z.string().optional(),
});

export const quickAssessmentInputSchema = z.object({
  currentRole: z.string().min(1, "現職または直近職種を入力してください"),
  desiredRole: z.string().min(1, "希望職種を入力してください"),
  preferredLocation: z.string().min(1, "希望勤務地を入力してください"),
  salaryRange: z.string().min(1, "年収レンジを入力してください"),
  currentWorry: worryOptionSchema,
  mode: appModeSchema,
});

export const quickAssessmentPayloadSchema = z.object({
  mode: appModeSchema,
  strengthTags: z.tuple([z.string(), z.string(), z.string()]),
  nextActions: z.tuple([z.string(), z.string(), z.string()]),
  improvementPoints: z.tuple([z.string(), z.string(), z.string()]),
  summary: z.string(),
});

export const quickAssessmentResultSchema = generationMetaSchema.extend({
  result: quickAssessmentPayloadSchema.optional(),
});

export const interviewAnswerSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  answer: z.string(),
  skipped: z.boolean(),
});

export const interviewStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  prompt: z.string(),
  placeholder: z.string(),
  mode: appModeSchema,
  optional: z.boolean(),
  branchKey: z.string().optional(),
});

export const candidateProfilePayloadSchema = z.object({
  mode: appModeSchema,
  headline: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  concerns: z.array(z.string()).min(1),
  careerAnchors: z.array(z.string()).min(1),
  recommendedRoles: z.array(z.string()).min(1),
  completionScore: z.number().min(0).max(100),
  evidenceGaps: z.array(z.string()).min(1),
  interviewHighlights: z.array(z.string()).min(1),
});

export const candidateProfileSchema = generationMetaSchema.extend({
  result: candidateProfilePayloadSchema.optional(),
});

export const resumeDraftPayloadSchema = z.object({
  basicInfo: z.object({
    fullName: z.string().default(""),
    currentRole: z.string(),
    preferredLocation: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  licenses: z.array(z.string()).optional(),
  constructionMeta: z
    .object({
      projectTypes: z.array(z.string()),
      structureTypes: z.array(z.string()),
      tradeScopes: z.array(z.string()),
      softwares: z.array(z.string()),
    })
    .optional(),
});

export const resumeDraftSchema = generationMetaSchema.extend({
  result: resumeDraftPayloadSchema.optional(),
});

export const careerHistoryPayloadSchema = z.object({
  headline: z.string(),
  experiences: z.array(
    z.object({
      company: z.string(),
      period: z.string(),
      role: z.string(),
      responsibilities: z.array(z.string()),
      achievements: z.array(z.string()),
      metricsSuggestions: z.array(z.string()),
    }),
  ),
  projectRecords: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        scale: z.string(),
        structure: z.string(),
        responsibility: z.string(),
        notes: z.array(z.string()),
      }),
    )
    .optional(),
});

export const careerHistoryDraftSchema = generationMetaSchema.extend({
  result: careerHistoryPayloadSchema.optional(),
});

export const selfPrPayloadSchema = z.object({
  tone: toneOptionSchema,
  body: z.string(),
  starBullets: z.array(z.string()),
  numericSuggestions: z.array(z.string()),
});

export const selfPrDraftSchema = generationMetaSchema.extend({
  result: selfPrPayloadSchema.optional(),
});

export const motivationPayloadSchema = z.object({
  templateLabel: z.string(),
  body: z.string(),
  customizationTips: z.array(z.string()),
});

export const motivationDraftSchema = generationMetaSchema.extend({
  result: motivationPayloadSchema.optional(),
});

export const interviewPrepPayloadSchema = z.object({
  expectedQuestions: z.array(
    z.object({
      question: z.string(),
      intent: z.string(),
      draftAnswer: z.string(),
      starRewrite: z.string().optional(),
      weakPoint: z.string().optional(),
    }),
  ),
  reverseQuestions: z.array(z.string()),
  coachingNotes: z.array(z.string()),
  constructionTips: z.array(z.string()).optional(),
});

export const interviewPrepResultSchema = generationMetaSchema.extend({
  result: interviewPrepPayloadSchema.optional(),
});

export const offerReviewInputSchema = z.object({
  rawText: z.string().min(1, "条件通知の文面を貼り付けてください"),
  sourceType: z.enum(["text", "pdf", "image"]),
  mode: appModeSchema,
});

export const offerReviewPayloadSchema = z.object({
  basicTerms: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      confidence: confidenceSchema,
    }),
  ),
  redFlagPoints: z.array(z.string()),
  checkQuestions: z.array(z.string()),
  negotiationDraft: z.string(),
  missingInfo: z.array(z.string()),
  overallConfidence: confidenceSchema,
  needsHumanReview: z.boolean(),
  disclaimer: z.string(),
});

export const offerReviewResultSchema = generationMetaSchema.extend({
  result: offerReviewPayloadSchema.optional(),
});

export const documentsBundleSchema = z.object({
  resumeDraft: resumeDraftSchema,
  careerHistoryDraft: careerHistoryDraftSchema,
  selfPRDraft: selfPrDraftSchema,
  motivationDraft: motivationDraftSchema,
});

export const sensitiveProfileInputSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

export const persistedSessionStateSchema = z.object({
  mode: appModeSchema,
  quickAssessment: quickAssessmentResultSchema.nullable(),
  interviewAnswers: z.array(interviewAnswerSchema),
  generatedProfile: candidateProfileSchema.nullable(),
  careerHistoryDraft: careerHistoryDraftSchema.nullable(),
  selfPRDraft: selfPrDraftSchema.nullable(),
  motivationDraft: motivationDraftSchema.nullable(),
  interviewPrep: interviewPrepResultSchema.nullable(),
  selectedSampleId: z.string().optional(),
  lastSavedAt: z.string().optional(),
});

export const volatileSessionStateSchema = z.object({
  resumeDraft: resumeDraftSchema.nullable(),
  offerReview: offerReviewResultSchema.nullable(),
  sensitiveProfileInput: sensitiveProfileInputSchema,
  offerReviewRawText: z.string(),
});

export type AppMode = z.infer<typeof appModeSchema>;
export type GenerationStatus = z.infer<typeof generationStatusSchema>;
export type ToneOption = z.infer<typeof toneOptionSchema>;
export type WorryOption = z.infer<typeof worryOptionSchema>;
export type QuickAssessmentInput = z.infer<typeof quickAssessmentInputSchema>;
export type QuickAssessmentResult = z.infer<typeof quickAssessmentResultSchema>;
export type InterviewAnswer = z.infer<typeof interviewAnswerSchema>;
export type InterviewStep = z.infer<typeof interviewStepSchema>;
export type CandidateProfile = z.infer<typeof candidateProfileSchema>;
export type ResumeDraft = z.infer<typeof resumeDraftSchema>;
export type CareerHistoryDraft = z.infer<typeof careerHistoryDraftSchema>;
export type SelfPRDraft = z.infer<typeof selfPrDraftSchema>;
export type MotivationDraft = z.infer<typeof motivationDraftSchema>;
export type InterviewPrepResult = z.infer<typeof interviewPrepResultSchema>;
export type OfferReviewInput = z.infer<typeof offerReviewInputSchema>;
export type OfferReviewResult = z.infer<typeof offerReviewResultSchema>;
export type DocumentsBundle = z.infer<typeof documentsBundleSchema>;
export type SensitiveProfileInput = z.infer<typeof sensitiveProfileInputSchema>;
