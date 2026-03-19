import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generateSalaryPDF = async (salary) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  // Set up fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add company header
  page.drawText('XYZ COMPANY', {
    x: 220,
    y: 750,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0.5),
  });

  page.drawText('Salary Slip', {
    x: 240,
    y: 710,
    size: 20,
    font: boldFont,
  });

  // Employee information section
  page.drawText(`Employee: ${salary.staffId?.name || 'N/A'}`, {
    x: 50,
    y: 650,
    size: 14,
    font,
  });

  page.drawText(`Employee ID: ${salary.staffId?.employeeId || 'N/A'}`, {
    x: 50,
    y: 625,
    size: 14,
    font,
  });

  page.drawText(`Month: ${salary.month}`, {
    x: 50,
    y: 600,
    size: 14,
    font,
  });

  // Salary breakdown
  page.drawText('-'.repeat(80), {
    x: 50,
    y: 570,
    size: 14,
    font,
  });

  // Earnings
  page.drawText('Earnings', {
    x: 50,
    y: 540,
    size: 16,
    font: boldFont,
  });

  page.drawText(`Basic Salary: $${salary.basicSalary?.toFixed(2) || '0.00'}`, {
    x: 50,
    y: 510,
    size: 14,
    font,
  });

  page.drawText(`Allowances: $${salary.allowances?.toFixed(2) || '0.00'}`, {
    x: 50,
    y: 485,
    size: 14,
    font,
  });

  // Deductions
  page.drawText('Deductions', {
    x: 50,
    y: 440,
    size: 16,
    font: boldFont,
  });

  page.drawText(`Tax: $${salary.deductions?.toFixed(2) || '0.00'}`, {
    x: 50,
    y: 410,
    size: 14,
    font,
  });

  // Net Salary
  const netSalary = (salary.basicSalary || 0) + (salary.allowances || 0) - (salary.deductions || 0);
  
  page.drawText('-'.repeat(80), {
    x: 50,
    y: 370,
    size: 14,
    font,
  });

  page.drawText('Net Salary', {
    x: 50,
    y: 340,
    size: 18,
    font: boldFont,
  });

  page.drawText(`$${netSalary.toFixed(2)}`, {
    x: 50,
    y: 310,
    size: 24,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  });

  // Footer
  page.drawText('This is computer generated document and does not require signature', {
    x: 100,
    y: 50,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Return the PDF as a buffer
  return await pdfDoc.save();
};