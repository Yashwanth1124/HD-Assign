import sgMail from '@sendgrid/mail';

// Sends OTP using SendGrid
export async function sendOTP(email: string, otp: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM || 'yashwanth73374@gmail.com'; // verified sender

  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not set');
  }
  if (!from) {
    throw new Error('SENDGRID_FROM not set');
  }

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to: email,
    from,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
  });
}