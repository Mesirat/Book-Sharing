import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { client, sender } from './mailtrap.config.js';

const sendEmail = async ({ to, subject, html, template_uuid, template_variables, category }) => {
  try {
    const options = {
      from: sender,
      to: [{ email: to }],
      subject,
      category,
    };

    if (html) {
      options.html = html;
    }

    if (template_uuid) {
      options.template_uuid = template_uuid;
      options.template_variables = template_variables;
    }

    const response = await client.send(options);
    console.log(`${category} email sent successfully`, response);
    return response;
  } catch (error) {
    console.error(`Error sending ${category} email:`, error);
    throw new Error(`Error sending ${category} email: ${error.message}`);
  }
};

export const sendVerificationEmail = (email, verificationToken) =>
  sendEmail({
    to: email,
    subject: "Verify your email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    category: "Email verification",
  });

export const sendWelcomeEmail = (email, name) =>
  sendEmail({
    to: email,
    template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
    template_variables: { company_info_name: "Bookish.com", name },
    category: "Welcome email",
  });

export const sendPasswordResetEmail = (email, resetURL) =>
  sendEmail({
    to: email,
    subject: "Reset your password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    category: "Password reset",
  });

export const sendResetSuccessEmail = (email) =>
  sendEmail({
    to: email,
    subject: "Password reset successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    category: "Password Reset Success",
  });
