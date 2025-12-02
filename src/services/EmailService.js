const nodemailer = require('nodemailer');
const axios = require('axios');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    this.pdfApiUrl = process.env.PDF_API_URL || 'https://pdf-service-sada.onrender.com/generate-pdf';
  }

  generateInvoiceTemplate(invoice, clinic, patient) {
    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatCurrency = (amount) => {
      return `PKR ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getStatusColor = (status) => {
      const colors = {
        paid: { bg: '#d1fae5', text: '#059669', border: '#10b981' }, // Green
        overdue: { bg: '#fee2e2', text: '#b91c1c', border: '#ef4444' }, // Red
        sent: { bg: '#dbeafe', text: '#1d4ed8', border: '#3b82f6' }, // Blue
        draft: { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' }  // Gray
      };
      return colors[status] || colors.draft;
    };

    const statusColor = getStatusColor(invoice.status);
    const themeColor = '#0891b2'; // Cyan-700 for a professional medical look

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoice.invoiceNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
      .no-print { display: none; }
      .page-break { page-break-inside: avoid; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155;">
  
  <div style="max-width: 800px; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    
    <div style="height: 8px; background: ${themeColor}; width: 100%;"></div>

    <div style="padding: 50px;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
        <tr>
          <td style="vertical-align: top;">
            <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
              ${clinic.name || 'DENTAL CLINIC'}
            </h1>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Excellence in Care</p>
          </td>
          <td align="right" style="vertical-align: top; color: #475569; font-size: 14px; line-height: 1.6;">
            <strong>${clinic.name || 'Clinic Name'}</strong><br>
            ${clinic.address || ''}<br>
            ${clinic.email || ''}<br>
            ${clinic.phone || ''}
          </td>
        </tr>
      </table>

      <div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
        <tr>
          <td width="55%" style="vertical-align: top; padding-right: 20px;">
            <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Bill To</p>
            <h3 style="margin: 0 0 5px 0; color: #0f172a; font-size: 20px; font-weight: 600;">${patient.name || 'Valued Patient'}</h3>
            <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
              ${patient.email ? `${patient.email}<br>` : ''}
              ${patient.phone ? `${patient.phone}<br>` : ''}
              ${patient.address ? `${patient.address}` : ''}
            </p>
          </td>

          <td width="45%" style="vertical-align: top;">
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td colspan="2" style="padding-bottom: 15px;">
                     <span style="background-color: ${statusColor.bg}; color: ${statusColor.text}; border: 1px solid ${statusColor.border}; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                        ${invoice.status}
                     </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; color: #64748b; font-size: 13px; font-weight: 500;">Invoice Number</td>
                  <td align="right" style="padding-bottom: 8px; color: #0f172a; font-size: 14px; font-weight: 700;">#${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; color: #64748b; font-size: 13px; font-weight: 500;">Issued Date</td>
                  <td align="right" style="padding-bottom: 8px; color: #0f172a; font-size: 14px; font-weight: 600;">${formatDate(invoice.issueDate)}</td>
                </tr>
                ${invoice.dueDate ? `
                <tr>
                  <td style="padding-top: 8px; border-top: 1px dashed #cbd5e1; color: #64748b; font-size: 13px; font-weight: 500;">Payment Due</td>
                  <td align="right" style="padding-top: 8px; border-top: 1px dashed #cbd5e1; color: #ef4444; font-size: 14px; font-weight: 700;">${formatDate(invoice.dueDate)}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          </td>
        </tr>
      </table>

      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 15px 20px; text-align: left; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Description</th>
              <th style="padding: 15px 20px; text-align: center; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Qty</th>
              <th style="padding: 15px 20px; text-align: right; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Price</th>
              <th style="padding: 15px 20px; text-align: right; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items && invoice.items.length > 0 ? invoice.items.map((item, index) => `
            <tr style="background-color: #ffffff;">
              <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px; font-weight: 500;">
                ${item.serviceName || item.description || 'Service'}
              </td>
              <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b; font-size: 14px;">${item.quantity || 1}</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #64748b; font-size: 14px;">${formatCurrency(item.unitPrice || item.price || 0)}</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-size: 14px; font-weight: 600;">${formatCurrency(item.total || 0)}</td>
            </tr>
            `).join('') : `
            <tr>
              <td colspan="4" style="padding: 40px; text-align: center; color: #94a3b8; font-size: 14px;">No items in this invoice</td>
            </tr>
            `}
          </tbody>
        </table>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="60%" style="vertical-align: top; padding-right: 40px;">
            ${invoice.notes ? `
            <div style="padding-top: 10px;">
               <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Notes</p>
               <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6; font-style: italic;">${invoice.notes}</p>
            </div>
            ` : ''}
          </td>

          <td width="40%" style="vertical-align: top;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Subtotal</td>
                <td align="right" style="padding: 10px 0; color: #334155; font-size: 14px; font-weight: 600;">${formatCurrency(invoice.subtotal || 0)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Tax</td>
                <td align="right" style="padding: 10px 0; color: #334155; font-size: 14px; font-weight: 600;">${formatCurrency(invoice.tax || 0)}</td>
              </tr>
              <tr>
                <td colspan="2" style="border-bottom: 2px solid ${themeColor}; padding-bottom: 10px;"></td>
              </tr>
              <tr>
                <td style="padding-top: 15px; color: #0f172a; font-size: 16px; font-weight: 700;">Total Amount</td>
                <td align="right" style="padding-top: 15px; color: ${themeColor}; font-size: 24px; font-weight: 800;">${formatCurrency(invoice.total || 0)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">Thank you for your trust in ${clinic.name || 'our clinic'}.</p>
        <p style="margin: 5px 0 0 0;">For questions, please contact ${clinic.phone || 'us'}.</p>
      </div>

    </div>
  </div>
</body>
</html>
    `;
  }

  async generateInvoicePDF(invoice, clinic, patient) {
    try {
      const htmlContent = this.generateInvoiceTemplate(invoice, clinic, patient);
      
      const response = await axios.post(this.pdfApiUrl, {
        html: htmlContent
      }, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error.response) {
        throw new Error(`PDF generation failed: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('PDF generation service is unavailable. Please try again later.');
      } else {
        throw new Error(`Failed to generate PDF: ${error.message}`);
      }
    }
  }

  async sendInvoice(invoice, clinic, patient, recipientEmail) {
    try {
      const htmlContent = this.generateInvoiceTemplate(invoice, clinic, patient);

      const mailOptions = {
        from: `"${clinic.name || 'Dental Clinic'}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Invoice #${invoice.invoiceNumber} - ${clinic.name || 'Dental Clinic'}`,
        html: htmlContent,
        text: `Invoice #${invoice.invoiceNumber}\n\nPlease find your invoice attached.\n\nTotal: PKR ${invoice.total}\n\nThank you!`
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();

