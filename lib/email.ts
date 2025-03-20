// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendApprovalEmail(to: string, title: string) {
  await transporter.sendMail({
    from: `"博客系统" <${process.env.EMAIL_USER}>`,
    to,
    subject: '您的文章已通过审核',
    html: `<p>您的文章《${title}》已通过审核并发布。</p>`,
  })
}