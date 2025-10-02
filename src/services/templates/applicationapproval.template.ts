export type JobApprovalInfo = {
  name?: string;
  email: string;
  jobTitle: string;
  clientName?: string
}

export function getApplicationApprovalTemplate(params: JobApprovalInfo): string {
  const displayName = params.name || params.email;
  return `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 32px;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e2e8f0;">
        <div style="text-align: center; padding: 32px 0 16px 0;">
          <img src="https://img.icons8.com/color/96/000000/medal2.png" alt="Congratulations" style="width: 64px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748; margin: 0;">Congratulations!</h2>
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <p style="font-size: 16px; color: #4a5568;">
            Hello <strong>${displayName}</strong>,
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            We are excited to inform you that your application for the position of <strong>${params.jobTitle}</strong> has been <span style="color: #38a169; font-weight: bold;">approved</span>!
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            ${params.clientName ? `The client, <strong>${params.clientName}</strong>, will be in touch with you soon to discuss the next steps.` : "The client will be in touch with you soon to discuss the next steps."}
          </p>
          <p style="font-size: 15px; color: #a0aec0; margin-top: 32px;">
            A follow-up email will be sent soon by our team.
          </p>
        </div>
      </div>
      <div style="text-align: center; color: #a0aec0; font-size: 13px; margin-top: 24px;">
        © 2024 JobMap. All rights reserved.
      </div>
    </div>
  `;
}