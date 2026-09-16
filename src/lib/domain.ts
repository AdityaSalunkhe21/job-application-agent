export type ApplicationStatus = "qualified" | "applying" | "applied" | "needs_attention";
export type Job = { requisitionId: string; company: string; title: string; location: string; employmentType: string; url: string; ats: "Workday" | "Greenhouse" | "Lever" | "Custom"; matchScore: number; skills: string[]; summary: string };
export type Application = Pick<Job, "company" | "title" | "location" | "ats" | "matchScore"> & { id: string; status: ApplicationStatus; updatedAt: string };
