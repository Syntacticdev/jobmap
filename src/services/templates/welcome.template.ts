export function getWelcomeEmailTemplate(user: { name?: string; email: string }): string {
  const displayName = user.name || user.email;
  return `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 32px;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e2e8f0;">
        <div style="text-align: center; padding: 32px 0 16px 0;">
          <img src="https://your-company-logo-url.com/logo.png" alt="Company Logo" style="width: 80px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748; margin: 0;">Welcome to JobMap!</h2>
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <p style="font-size: 16px; color: #4a5568;">
            Hello <strong>${displayName}</strong>,
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            We're excited to have you join <strong>JobMap</strong>! Start exploring jobs, connecting with clients, and growing your career.
          </p>
          <p style="font-size: 15px; color: #a0aec0; margin-top: 32px;">
            If you have any questions, just reply to this email—we're here to help!
          </p>
        </div>
      </div>
      <div style="text-align: center; color: #a0aec0; font-size: 13px; margin-top: 24px;">
        © 2024 JobMap. All rights reserved.
      </div>
    </div>
  `;
}