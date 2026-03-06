import type {
  CandidateProfile,
  DocumentsBundle,
  InterviewAnswer,
  InterviewPrepResult,
  OfferReviewInput,
  OfferReviewResult,
  QuickAssessmentInput,
  QuickAssessmentResult,
  SensitiveProfileInput,
  ToneOption,
} from "@/lib/schemas/domain";

export interface GenerateProfileInput {
  mode: QuickAssessmentInput["mode"];
  quickAssessment: QuickAssessmentInput;
  answers: InterviewAnswer[];
}

export interface GenerateDocumentsInput extends GenerateProfileInput {
  profile: CandidateProfile;
  tone?: ToneOption;
  sensitiveInput?: SensitiveProfileInput;
}

export interface GenerateInterviewPrepInput extends GenerateProfileInput {
  profile: CandidateProfile;
}

export interface AiProvider {
  generateQuickAssessment(
    input: QuickAssessmentInput,
  ): Promise<QuickAssessmentResult>;
  generateProfile(input: GenerateProfileInput): Promise<CandidateProfile>;
  generateDocuments(input: GenerateDocumentsInput): Promise<DocumentsBundle>;
  generateInterviewPrep(
    input: GenerateInterviewPrepInput,
  ): Promise<InterviewPrepResult>;
  generateOfferReview(input: OfferReviewInput): Promise<OfferReviewResult>;
}
