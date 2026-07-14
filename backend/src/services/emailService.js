import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

const getSender = () => ({
  name: process.env.BREVO_FROM_NAME || 'Empower Jhang',
  email: process.env.BREVO_FROM_EMAIL || 'info@empowerjhang.org'
});

/**
 * Sends a 6-digit OTP code to the user's email address.
 */
export const sendOtpEmail = async (email, code) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = `Verify Your Email – Empower Jhang`;
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1D2B57; padding: 30px; max-width: 600px; margin: 0 auto; background-color: #FAFCFF; border: 1px solid #E2E8F0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1E3A8A; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Empower Jhang</h2>
          <p style="color: #10B981; font-size: 14px; font-weight: 600; text-transform: uppercase; margin: 4px 0 0 0; letter-spacing: 2px;">Learn • Connect • Grow</p>
        </div>
        <div style="background-color: #FFFFFF; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #EDF2F7;">
          <p style="font-size: 16px; line-height: 1.6; color: #4A5568; margin-top: 0;">Hello,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">Thank you for your interest in joining <strong>Empower Jhang</strong>. To complete your verification and access the community registration form, please enter the code below:</p>
          
          <div style="background-color: #F8FAFC; border: 1px dashed #CBD5E1; padding: 20px; text-align: center; border-radius: 12px; margin: 28px 0;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1E3A8A; font-family: monospace;">${code}</span>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #718096; margin-bottom: 0;"><strong>Security Note:</strong> This code is valid for exactly <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #A0AEC0;">
          <p style="margin: 0;">This email was sent to ${email} as part of the community registration step.</p>
          <p style="margin: 4px 0 0 0;">Empower Jhang Community Forum, Jhang, Punjab, Pakistan.</p>
        </div>
      </body>
    </html>
  `;
  
  sendSmtpEmail.sender = getSender();
  sendSmtpEmail.to = [{ email }];

  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Error sending OTP email via Brevo:', error);
    throw new Error('Failed to send verification email.');
  }
};

/**
 * Sends a welcome email containing their Member ID and community links.
 */
export const sendWelcomeEmail = async (email, name, memberId) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = `Welcome to Empower Jhang – Member ID: ${memberId}`;
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2D3748; padding: 30px; max-width: 600px; margin: 0 auto; background-color: #FAFCFF; border: 1px solid #E2E8F0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1E3A8A; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Empower Jhang</h2>
          <p style="color: #10B981; font-size: 14px; font-weight: 600; text-transform: uppercase; margin: 4px 0 0 0; letter-spacing: 2px;">Learn • Connect • Grow</p>
        </div>
        
        <div style="background-color: #FFFFFF; padding: 28px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #EDF2F7;">
          <h3 style="color: #1A202C; font-size: 20px; margin-top: 0; margin-bottom: 12px;">Congratulations, ${name}!</h3>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568; margin-bottom: 20px;">
            Welcome to Empower Jhang! You are now officially registered as a member of our digital community.
          </p>

          <div style="background-color: #EEF2F6; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #64748B;">YOUR OFFICIAL MEMBER ID:</p>
            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800; color: #1E3A8A;">${memberId}</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #4A5568; margin-bottom: 16px;">
            You can access, view, and download your digital member card at any time through our portal. Let's get started by connecting on our active platforms:
          </p>

          <div style="margin: 24px 0; text-align: center;">
            <a href="https://facebook.com/groups/empowerjhang" style="display: inline-block; padding: 12px 24px; background-color: #1E3A8A; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px; font-size: 14px;">Join Facebook Group</a>
            <a href="https://chat.whatsapp.com/empowerjhang" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px; font-size: 14px;">WhatsApp Community</a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #4A5568; margin-bottom: 0;">
            If you have any questions or require support, please contact us at <a href="mailto:info@empowerjhang.org" style="color: #1E3A8A;">info@empowerjhang.org</a>.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #A0AEC0;">
          <p style="margin: 0;">You received this welcome email because you completed registration with Empower Jhang.</p>
        </div>
      </body>
    </html>
  `;

  sendSmtpEmail.sender = getSender();
  sendSmtpEmail.to = [{ email }];

  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
  }
};

/**
 * Sends a notification email to the administrator about a new member registration.
 */
export const sendAdminNotification = async (memberName, memberId, district) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  const systemSender = getSender();

  sendSmtpEmail.subject = `New Member Registered – ${memberName} (${memberId})`;
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2>Empower Jhang System Notification</h2>
        <p>A new member has successfully registered on the platform:</p>
        <ul>
          <li><strong>Full Name:</strong> ${memberName}</li>
          <li><strong>Member ID:</strong> ${memberId}</li>
          <li><strong>District:</strong> ${district}</li>
          <li><strong>Registration Time:</strong> ${new Date().toUTCString()}</li>
        </ul>
        <p>You can manage profiles and verify users in the Administrator Dashboard.</p>
      </body>
    </html>
  `;

  sendSmtpEmail.sender = systemSender;
  sendSmtpEmail.to = [{ email: systemSender.email }];

  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
};
