import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

export async function sendEmail(to: string, subject: string, templateName: string, data: object) {
    const html = await renderEmail(templateName, data);
    
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

export async function renderEmail(templateName: string, data: object) {
  const filePath = path.join(__dirname, `../templates/${templateName}.ejs`);
  return ejs.renderFile(filePath, data, { async: true });
}