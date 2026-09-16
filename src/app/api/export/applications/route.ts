import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const applications = await prisma.application.findMany({ include: { job: true }, orderBy: { updatedAt: "desc" } });
  const rows = applications.map((application) => ({ Company: application.job.company, Role: application.job.title, Location: application.job.location ?? "", ATS: application.job.ats, "Job URL": application.job.url, "Requisition ID": application.job.requisitionId ?? "", "Match score": application.job.matchScore ?? "", Status: application.status, "Applied date": application.appliedAt?.toISOString().slice(0, 10) ?? "", "Confirmation code": application.confirmationCode ?? "", Notes: application.notes ?? "" }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Applications");
  const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new Response(bytes, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=job-applications.xlsx" } });
}
