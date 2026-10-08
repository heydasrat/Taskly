import nodemailer from 'nodemailer'
import config from '../config/config.js';

const missingGoogleOAuthConfig = !config.googleClientId || !config.googleClientSecret || !config.googleRefreshToken || !config.googleUserEmail;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.googleUserEmail,
    clientId: config.googleClientId,
    clientSecret: config.googleClientSecret,
    refreshToken: config.googleRefreshToken,
  },
});

if (missingGoogleOAuthConfig) {
  console.warn('Gmail OAuth2 config is incomplete. Email delivery will fail until GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and EMAIL_USER are set correctly.');
}

transporter.verify((error, success) => {
  if (error) {
    console.error('Email OAuth2 verification failed. Check Google OAuth client, refresh token, and Gmail account permissions.');
    console.error(error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    if (missingGoogleOAuthConfig) {
      throw new Error('Gmail OAuth2 configuration is incomplete. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and EMAIL_USER in the backend environment.');
    }

    const info = await transporter.sendMail({
      from: `Taskly <${config.googleUserEmail}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    return error;
  }
};

