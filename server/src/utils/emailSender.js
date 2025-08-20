const nodemailer = require('nodemailer');

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send verification email
  async sendVerificationEmail(email, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Email Verification - AIHS',
      html: `
        <h1>Verify Your Email</h1>
        <p>Thank you for registering with Axolotl International High School. Please verify your email address to complete your registration.</p>
        <p><a href="${verificationUrl}" style="padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
    };

    try {
      await this.transporter.sendMail(message);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email, name) {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to AIHS!',
      html: `
        <h1>Welcome to Axolotl International High School!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for verifying your email address. Your account is now fully activated.</p>
        <p>You can now access all features of our platform:</p>
        <ul>
          <li>View your class schedule</li>
          <li>Access course materials</li>
          <li>Communicate with teachers</li>
          <li>And much more!</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>AIHS Team</p>
      `
    };

    try {
      await this.transporter.sendMail(message);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }
}

module.exports = new EmailSender();
