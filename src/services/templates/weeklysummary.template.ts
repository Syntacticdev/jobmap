export type JobUser = { name?: string; email: string };
export type JobStatus = "Open" | "In Progress" | "Closed";
export type JobInfo = {
  title: string;
  applicantCount: number;
  status: JobStatus;
  dueDate: string;
};
export function getWeeklySummaryTemplate(params: {
  user: JobUser,
  jobs: JobInfo[],
  notes?: string,
  reportUrl?: string
}): string {
  const displayName = params.user.name || params.user.email;
  const jobRows = params.jobs.map(job => `
    <tr>
      <td style="padding: 8px 12px; background: #fff; color: #2d3748;">${job.title}</td>
      <td style="padding: 8px 12px; background: #fff; color: #2d3748; text-align: center;">${job.applicantCount}</td>
      <td style="padding: 8px 12px; background: #fff; color: #2d3748; text-align: center;">${job.status}</td>
      <td style="padding: 8px 12px; background: #fff; color: #2d3748; text-align: center;">${job.dueDate}</td>
    </tr>
  `).join("");

  return `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e2e8f0;">
        <div style="text-align: center; padding: 32px 0 16px 0;">
          <img src="https://img.icons8.com/color/96/000000/weekly-calendar.png" alt="Weekly Summary" style="width: 80px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748; margin: 0;">Your Weekly Job Summary</h2>
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <p style="font-size: 16px; color: #4a5568;">
            Hello <strong>${displayName}</strong>,
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            Here’s a summary of your open jobs this week:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr>
                <th style="padding: 8px 12px; background: #f7fafc; color: #2d3748; text-align: left;">Job Title</th>
                <th style="padding: 8px 12px; background: #f7fafc; color: #2d3748; text-align: center;">Applicants</th>
                <th style="padding: 8px 12px; background: #f7fafc; color: #2d3748; text-align: center;">Status</th>
                <th style="padding: 8px 12px; background: #f7fafc; color: #2d3748; text-align: center;">Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${jobRows}
            </tbody>
          </table>
          ${params.notes ? `<p style="font-size: 15px; color: #4a5568; margin-top: 16px;"><strong>Notes:</strong> ${params.notes}</p>` : ""}
          ${params.reportUrl ? `
            <div style="text-align: center; margin-top: 32px;">
              <a href="${params.reportUrl}" style="display: inline-block; background: #3182ce; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 16px;">
                View Full Report
              </a>
            </div>
          ` : ""}
        </div>
      </div>
      <div style="text-align: center; color: #a0aec0; font-size: 13px; margin-top: 24px;">
        © 2024 JobMap. All rights reserved.
      </div>
    </div>
  `;
}