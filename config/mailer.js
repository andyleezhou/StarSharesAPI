const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Function to send email to the user
module.exports.sendingMail = async ({ from, to, subject, text, authorizationCode }) => {
  try {
    // Create an OAuth2 client instance
    const oauth2Client = new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(authorizationCode);

    // Set the credentials
    oauth2Client.setCredentials(tokens);

    // Configure Nodemailer transport with OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'starsharesapp@gmail.com', // Your Gmail address
        accessToken: tokens.access_token,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: tokens.refresh_token,
      }
    });

    // Define mail options
    const mailOptions = {
      from,
      to,
      subject,
      text,
    };

    // Send mail using the transporter
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send email');
  }
};
