const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  oauth_link
);

exports.sendverifiedEmail = (email, name, url) => {
  auth.setCredentials({
    refresh_token: MAILING_REFRESH,
  });
  const accessToken = auth.getAccessToken();
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken,
    },
  });
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Social APP Verification",
    html: `<!DOCTYPE html><html> <body style="background-color: #e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"> <tr> <td align="center" valign="top" style="padding: 36px 24px"> </td> </tr> </td> </tr> <tr> <td align="center" bgcolor="#e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="left" bgcolor="#ffffff" style=" padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf; " > <h1 style=" margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; " > Confirm Your Email Address </h1> </td> </tr> </table> </td> </tr> <tr> <td align="center" bgcolor="#e9ecef"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px" > <tr> <td align="left" bgcolor="#ffffff" style=" padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; " > <p style="margin: 0"> Hello ${name},<br> Tap the button below to confirm your email address. If you didn't create an account in social app, you can safely delete this email. </p> </td> </tr> <tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px" > <a href=${url} target="_blank" onmouseover="this.style.color='black'" onmouseout="this.style.color='#ffffff'" style=" display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 550; color: #ffffff; text-decoration: none; border-radius: 6px; " >Verify Email Address</a > </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td align="left" bgcolor="#ffffff" style=" padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf; " > <p style="margin: 0"> Cheers,<br /> Social App </p> </td> </tr> </table> </td> </tr> </td> </tr> </table> </body></html>`,
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};
