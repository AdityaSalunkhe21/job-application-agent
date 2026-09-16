export type ApprovedAnswer = { patterns: RegExp[]; answer: string; sensitive?: boolean };

export const approvedAnswers: ApprovedAnswer[] = [
  { patterns: [/authorized to work/i, /lawfully.*country/i], answer: "Yes", sensitive: true },
  { patterns: [/require sponsorship/i, /visa status/i], answer: "No", sensitive: true },
  { patterns: [/at least 18/i, /18 years/i], answer: "Yes", sensitive: true },
  { patterns: [/willing to relocate/i, /relocation/i], answer: "Yes" },
  { patterns: [/basic.*essential qualifications/i, /meet.*qualifications/i], answer: "Yes" },
  { patterns: [/salary|hourly rate|compensation expectation/i], answer: "8LPA", sensitive: true },
  { patterns: [/willing to travel|travel.*how much/i], answer: "Yes, I am willing to travel between 25% to 50%." },
  { patterns: [/notification updates|application journey|message and data rates/i], answer: "WhatsApp and email" },
];

export function findApprovedAnswer(question: string): ApprovedAnswer | undefined {
  return approvedAnswers.find(({ patterns }) => patterns.every((pattern) => pattern.test(question)) || patterns.some((pattern) => pattern.test(question)));
}
