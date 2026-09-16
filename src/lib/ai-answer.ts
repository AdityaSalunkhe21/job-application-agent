import { GoogleGenAI } from "@google/genai";
import { approvedAnswers, findApprovedAnswer } from "./answer-policy";

export type AiAnswerDecision = { answer: string | null; confidence: number; reason: string; requiresReview: boolean };

export async function classifyApplicationQuestion(question: string, options: string[] = []): Promise<AiAnswerDecision> {
  const deterministic = findApprovedAnswer(question);
  if (deterministic) return { answer: deterministic.answer, confidence: 1, reason: "Matched approved answer policy", requiresReview: false };
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { answer: null, confidence: 0, reason: "Gemini API key is not configured", requiresReview: true };
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    contents: `Classify this job application question against the approved policies. Never invent a legal, immigration, demographic, or compensation answer. Return JSON only with answer, confidence (0 to 1), reason, requiresReview. Question: ${question}\nOptions: ${options.join(" | ")}\nApproved policies: ${approvedAnswers.map((item) => `${item.patterns.map(String).join(",")} => ${item.answer}`).join("; ")}`,
    config: { responseMimeType: "application/json" },
  });
  const parsed = JSON.parse(response.text ?? "{}");
  const confidence = Number(parsed.confidence ?? 0);
  return { answer: confidence >= 0.92 ? String(parsed.answer ?? "") : null, confidence, reason: String(parsed.reason ?? "AI could not justify a safe answer"), requiresReview: confidence < 0.92 || Boolean(parsed.requiresReview) };
}
