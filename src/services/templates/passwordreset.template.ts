export function getPasswordResetTemplate(params: { email: string; code: string | number; expirationMinutes?: number }): string {
  const expirationText = params.expirationMinutes
    ? `This code will expire in ${params.expirationMinutes} minutes.`
    : "This code will expire soon.";

  return `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 32px;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e2e8f0;">
        <div style="text-align: center; padding: 32px 0 16px 0;">
          <img src="https://img.icons8.com/color/96/000000/password-reset.png" alt="Password Reset" style="width: 64px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748; margin: 0;">Password Reset Code</h2>
        </div>
        <div style="padding: 0 32px 32px 32px;">
                 <p style="font-size: 16px; color: #4a5568;">
            Use the code below to reset your password:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; color: #3182ce; font-weight: bold; background: #f7fafc; padding: 12px 24px; border-radius: 6px;">
              ${params.code}
            </span>
          </div>
          <p style="font-size: 15px; color: #a0aec0; margin-top: 16px;">
            ${expirationText}
          </p>
          <p style="font-size: 15px; color: #a0aec0;">
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      </div>
      <div style="text-align: center; color: #a0aec0; font-size: 13px; margin-top: 24px;">
        © 2024 JobMap. All rights reserved.
      </div>
    </div>
  `;
}