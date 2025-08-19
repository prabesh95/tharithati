// /app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { selectedRows, email } = await req.json();

  // Configure transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTable = `
    <table border="1" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Sl. No.</th>
          <th>IFB No.</th>
          <th>Project Title</th>
          <th>Public Entity</th>
          <th>Procurement Type</th>
          <th>Status</th>
          <th>Notice Date</th>
          <th>Last Bid Date</th>
          <th>Days Left</th>
        </tr>
      </thead>
      <tbody>
        ${selectedRows.map(row => `
          <tr>
            <td>${row.slNo}</td>
            <td>${row.ifbNo}</td>
            <td>${row.projectTitle}</td>
            <td>${row.publicEntity}</td>
            <td>${row.procurementType}</td>
            <td>${row.status}</td>
            <td>${row.noticeDate}</td>
            <td>${row.lastBidDate}</td>
            <td>${row.daysLeft}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Selected Bid Data',
      html: htmlTable,
    });
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to send email', error: err });
  }
}
