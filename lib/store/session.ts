"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getMockSample } from "@/lib/mock/samples";
import type {
  AppMode,
  CandidateProfile,
  CareerHistoryDraft,
  InterviewAnswer,
  InterviewPrepResult,
  MotivationDraft,
  OfferReviewResult,
  QuickAssessmentInput,
  QuickAssessmentResult,
  ResumeDraft,
  SelfPRDraft,
  SensitiveProfileInput,
} from "@/lib/schemas/domain";

type SessionState = {
  mode: AppMode;
  quickAssessmentInput: QuickAssessmentInput | null;
  quickAssessment: QuickAssessmentResult | null;
  interviewAnswers: InterviewAnswer[];
  generatedProfile: CandidateProfile | null;
  resumeDraft: ResumeDraft | null;
  careerHistoryDraft: CareerHistoryDraft | null;
  selfPRDraft: SelfPRDraft | null;
  motivationDraft: MotivationDraft | null;
  interviewPrep: InterviewPrepResult | null;
  offerReview: OfferReviewResult | null;
  selectedSampleId?: string;
  lastSavedAt?: string;
  sensitiveProfileInput: SensitiveProfileInput;
  offerReviewRawText: string;
};

type SessionActions = {
  setMode: (mode: AppMode) => void;
  setQuickAssessmentInput: (quickAssessmentInput: QuickAssessmentInput | null) => void;
  setQuickAssessment: (quickAssessment: QuickAssessmentResult | null) => void;
  setInterviewAnswer: (answer: InterviewAnswer) => void;
  skipInterviewAnswer: (questionId: string, question: string) => void;
  setGeneratedProfile: (generatedProfile: CandidateProfile | null) => void;
  setResumeDraft: (resumeDraft: ResumeDraft | null) => void;
  setCareerHistoryDraft: (careerHistoryDraft: CareerHistoryDraft | null) => void;
  setSelfPRDraft: (selfPRDraft: SelfPRDraft | null) => void;
  setMotivationDraft: (motivationDraft: MotivationDraft | null) => void;
  setInterviewPrep: (interviewPrep: InterviewPrepResult | null) => void;
  setOfferReview: (offerReview: OfferReviewResult | null) => void;
  setSensitiveProfileInput: (input: SensitiveProfileInput) => void;
  setOfferReviewRawText: (text: string) => void;
  loadSample: (sampleId: string) => void;
  resetSession: () => void;
  markSaved: () => void;
};

export function partializeSessionState(state: SessionState & SessionActions) {
  return {
    mode: state.mode,
    quickAssessmentInput: state.quickAssessmentInput,
    quickAssessment: state.quickAssessment,
    interviewAnswers: state.interviewAnswers,
    generatedProfile: state.generatedProfile,
    careerHistoryDraft: state.careerHistoryDraft,
    selfPRDraft: state.selfPRDraft,
    motivationDraft: state.motivationDraft,
    interviewPrep: state.interviewPrep,
    selectedSampleId: state.selectedSampleId,
    lastSavedAt: state.lastSavedAt,
  };
}

const initialState: SessionState = {
  mode: "general",
  quickAssessmentInput: null,
  quickAssessment: null,
  interviewAnswers: [],
  generatedProfile: null,
  resumeDraft: null,
  careerHistoryDraft: null,
  selfPRDraft: null,
  motivationDraft: null,
  interviewPrep: null,
  offerReview: null,
  selectedSampleId: undefined,
  lastSavedAt: undefined,
  sensitiveProfileInput: {},
  offerReviewRawText: "",
};

export const useCareerSessionStore = create<SessionState & SessionActions>()(
  persist<
    SessionState & SessionActions,
    [],
    [],
    ReturnType<typeof partializeSessionState>
  >(
    (set) => ({
      ...initialState,
      setMode: (mode) => set({ mode }),
      setQuickAssessmentInput: (quickAssessmentInput) => set({ quickAssessmentInput }),
      setQuickAssessment: (quickAssessment) => set({ quickAssessment }),
      setInterviewAnswer: (answer) =>
        set((state) => ({
          interviewAnswers: [
            ...state.interviewAnswers.filter(
              (current) => current.questionId !== answer.questionId,
            ),
            answer,
          ],
        })),
      skipInterviewAnswer: (questionId, question) =>
        set((state) => ({
          interviewAnswers: [
            ...state.interviewAnswers.filter(
              (current) => current.questionId !== questionId,
            ),
            { questionId, question, answer: "", skipped: true },
          ],
        })),
      setGeneratedProfile: (generatedProfile) => set({ generatedProfile }),
      setResumeDraft: (resumeDraft) => set({ resumeDraft }),
      setCareerHistoryDraft: (careerHistoryDraft) => set({ careerHistoryDraft }),
      setSelfPRDraft: (selfPRDraft) => set({ selfPRDraft }),
      setMotivationDraft: (motivationDraft) => set({ motivationDraft }),
      setInterviewPrep: (interviewPrep) => set({ interviewPrep }),
      setOfferReview: (offerReview) => set({ offerReview }),
      setSensitiveProfileInput: (input) =>
        set((state) => ({
          sensitiveProfileInput: { ...state.sensitiveProfileInput, ...input },
        })),
      setOfferReviewRawText: (text) => set({ offerReviewRawText: text }),
      loadSample: (sampleId) => {
        const sample = getMockSample(sampleId);
        set({
          mode: sample.profile.result?.mode ?? "general",
          quickAssessmentInput: {
            currentRole: sample.documents.resumeDraft.result?.basicInfo.currentRole ?? "",
            desiredRole: sample.profile.result?.recommendedRoles[0] ?? "",
            preferredLocation:
              sample.documents.resumeDraft.result?.basicInfo.preferredLocation ?? "",
            salaryRange: "400万〜500万円",
            currentWorry: "書類に自信がない",
            mode: sample.profile.result?.mode ?? "general",
          },
          selectedSampleId: sampleId,
          quickAssessment: sample.quickAssessment,
          generatedProfile: sample.profile,
          resumeDraft: sample.documents.resumeDraft,
          careerHistoryDraft: sample.documents.careerHistoryDraft,
          selfPRDraft: sample.documents.selfPRDraft,
          motivationDraft: sample.documents.motivationDraft,
          interviewPrep: sample.interviewPrep,
          offerReview: sample.offerReview,
          interviewAnswers: [],
          offerReviewRawText: "",
        });
      },
      resetSession: () => set({ ...initialState }),
      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
    }),
    {
      name: "career-os-session-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: partializeSessionState,
    },
  ),
);

export const selectHasMinimumProfileData = (
  state: SessionState,
) => Boolean(state.quickAssessment && state.generatedProfile);

export const selectDocumentCompletion = (state: SessionState) =>
  [
    state.resumeDraft?.status === "success",
    state.careerHistoryDraft?.status === "success",
    state.selfPRDraft?.status === "success",
    state.motivationDraft?.status === "success",
  ].filter(Boolean).length;

export const selectCurrentInterviewProgress = (
  state: SessionState,
  totalSteps: number,
) => {
  if (!totalSteps) return 0;
  return Math.min(100, Math.round((state.interviewAnswers.length / totalSteps) * 100));
};

export const selectNeedsDeferredDocumentsGeneration = (state: SessionState) =>
  !state.resumeDraft || !state.careerHistoryDraft || !state.selfPRDraft || !state.motivationDraft;

export const selectNeedsDeferredInterviewPrepGeneration = (state: SessionState) =>
  !state.interviewPrep;
